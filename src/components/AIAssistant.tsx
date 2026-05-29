import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import {
  BOT_NAME,
  getAssistantResponseAsync,
  scrollToSection,
  getQuickActionsForUser,
  WELCOME_GREETING,
  WELCOME_MESSAGE,
  WELCOME_SUBLINE,
} from '../lib/aiAssistant';
import type { QuickAction } from '../lib/aiAssistant';
import { useAuth } from '../contexts/AuthContext';
import './AIAssistant.css';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

function buildWelcomeMessage(name?: string, domains: string[] = []): string {
  if (!name) return WELCOME_MESSAGE;
  const focus = domains.slice(0, 2).join(' and ');
  if (!focus) return `Hi ${name}! I’m CSI Nova 👋\nReady to help with events, registrations, and resources.`;
  return `Hi ${name}! I’m CSI Nova 👋\nI can recommend ${focus} opportunities and upcoming CSI events.`;
}

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function NovaRobot({
  size = 'md',
  interactive = false,
  mood = 'idle',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  mood?: 'idle' | 'thinking' | 'speaking';
}) {
  return (
    <span
      className={`nova-robot nova-robot--${size} nova-robot--${mood}${
        interactive ? ' nova-robot--interactive' : ''
      }`}
      aria-hidden
    >
      <span className="nova-robot__ambient" />
      <span className="nova-robot__shadow" />
      <span className="nova-robot__halo" />
      <span className="nova-robot__float">
        <span className="nova-robot__antenna">
          <span className="nova-robot__antenna-tip" />
        </span>
        <span className="nova-robot__head">
          <span className="nova-robot__head-shell" />
          <span className="nova-robot__face">
            <span className="nova-robot__eye nova-robot__eye--left" />
            <span className="nova-robot__eye nova-robot__eye--right" />
            <span className="nova-robot__mouth" />
          </span>
          <span className="nova-robot__head-shine" />
          <span className="nova-robot__holo" />
        </span>
        <span className="nova-robot__torso">
          <span className="nova-robot__core" />
        </span>
      </span>
    </span>
  );
}

function AssistantReply({
  children,
  streaming = false,
  thinking = false,
}: {
  children: ReactNode;
  streaming?: boolean;
  thinking?: boolean;
}) {
  const mood = thinking ? 'thinking' : streaming ? 'speaking' : 'idle';
  const replyClass = [
    'ai-assistant__reply',
    streaming ? 'ai-assistant__reply--streaming' : '',
    thinking ? 'ai-assistant__reply--thinking' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={replyClass}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: CINEMATIC_EASE }}
    >
      <span className="ai-assistant__reply-ambient" aria-hidden />
      <motion.div
        className="ai-assistant__reply-bot"
        initial={{ opacity: 0, scale: 0.8, x: -12, y: 6 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 0.45, ease: CINEMATIC_EASE, delay: 0.05 }}
        title={BOT_NAME}
      >
        <NovaRobot size="md" interactive mood={mood} />
      </motion.div>
      <div className="ai-assistant__reply-body">{children}</div>
    </motion.div>
  );
}

export default function AIAssistant() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', text: WELCOME_MESSAGE },
  ]);
  const [thinking, setThinking] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typingText, thinking]);

  useEffect(() => {
    const personalized = buildWelcomeMessage(
      (profile?.displayName || user?.displayName || '').split(' ')[0],
      profile?.domainInterests ?? []
    );
    setMessages((prev) => {
      if (!prev.length || prev[0]?.id !== 'welcome') return prev;
      const next = [...prev];
      next[0] = { ...next[0], text: personalized };
      return next;
    });
  }, [profile?.displayName, profile?.domainInterests, user?.displayName]);

  useEffect(() => {
    const onOpenNova = () => setOpen(true);
    window.addEventListener('csi-open-nova', onOpenNova);
    return () => window.removeEventListener('csi-open-nova', onOpenNova);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const suggestedActions = useMemo(
    () => getQuickActionsForUser(Boolean(user)) as QuickAction[],
    [user]
  );

  const close = useCallback(() => {
    setOpen(false);
    setThinking(false);
    setTypingText('');
    if (typingTimer.current) window.clearInterval(typingTimer.current);
    typingTimer.current = null;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const handlePanelMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
  }, []);

  const runAssistant = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText) return;

    if (typingTimer.current) window.clearInterval(typingTimer.current);
    typingTimer.current = null;

    setInput('');
    setThinking(true);
    setTypingText('');

    const userMsg: ChatMessage = { id: uid(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);

    await new Promise((r) => setTimeout(r, 500));

    const { text: reply, scrollTo } = await getAssistantResponseAsync(userText);

    setThinking(false);
    const full = reply.replaceAll('**', '');
    let i = 0;

    setTypingText('');
    const interval = window.setInterval(() => {
      i += Math.max(1, Math.floor(full.length / 100));
      const next = full.slice(0, Math.min(full.length, i));
      setTypingText(next);

      if (i >= full.length) {
        window.clearInterval(interval);
        typingTimer.current = null;
        setTypingText('');
        setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text: reply }]);

        if (scrollTo) {
          closeTimer.current = window.setTimeout(() => {
            scrollToSection(scrollTo);
          }, 300);
        }
      }
    }, 16);

    typingTimer.current = interval;
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      runAssistant(input);
    },
    [runAssistant, input]
  );

  const onQuickAction = useCallback(
    (action: QuickAction) => {
      setOpen(true);
      runAssistant(action.query);
    },
    [runAssistant]
  );

  const panelStyle = {
    '--glow-x': `${glowPos.x}%`,
    '--glow-y': `${glowPos.y}%`,
  } as CSSProperties;

  const ui = (
    <div className={`ai-assistant${open ? ' ai-assistant--open' : ''}`} aria-live="polite">
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-assistant__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
            onClick={close}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="ai-panel"
            className="ai-assistant__panel"
            data-lenis-prevent
            style={panelStyle}
            role="dialog"
            aria-modal="true"
            aria-label={`${BOT_NAME} chat`}
            initial={{ opacity: 0, scale: 0.96, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, y: 10, filter: 'blur(2px)' }}
            transition={{ duration: 0.32, ease: CINEMATIC_EASE }}
            onMouseMove={handlePanelMove}
          >
            <div className="ai-assistant__panel-shell" aria-hidden>
              <span className="ai-assistant__neon-edge" />
              <span className="ai-assistant__edge-glow" />
              <span className="ai-assistant__cursor-glow" />
              <span className="ai-assistant__scanlines" />
              <span className="ai-assistant__holo-sweep" />
            </div>

            <div className="ai-assistant__panel-particles" aria-hidden>
              {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} className="ai-assistant__particle" style={{ '--i': i } as CSSProperties} />
              ))}
            </div>

            <div className="ai-assistant__os-strip" aria-hidden>
              <span className="ai-assistant__os-strip-dot" />
              <span>CSI Nova Core · v2.0</span>
              <span className="ai-assistant__os-strip-tag">SECURE LINK</span>
            </div>

            <header className="ai-assistant__header">
              <div className="ai-assistant__header-info">
                <div className="ai-assistant__header-bot">
                  <NovaRobot size="md" mood="idle" />
                </div>
                <div className="ai-assistant__header-text">
                  <div className="ai-assistant__title-row">
                    <Sparkles size={13} strokeWidth={2} className="ai-assistant__title-icon" />
                    <p className="ai-assistant__title">{BOT_NAME}</p>
                  </div>
                  <p className="ai-assistant__subtitle">CSI VIT Chennai · AI Campus Guide</p>
                  <div className="ai-assistant__status">
                    <span className="ai-assistant__status-dot" aria-hidden />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <button type="button" className="ai-assistant__close" onClick={close} aria-label="Close panel">
                <X size={16} strokeWidth={2} />
              </button>
            </header>

            <div className="ai-assistant__messages" ref={scrollRef}>
              {messages.map((m) =>
                m.role === 'assistant' ? (
                  <AssistantReply key={m.id}>
                    <motion.article
                      className={`ai-assistant__bubble ai-assistant__bubble--assistant${
                        m.id === 'welcome' ? ' ai-assistant__bubble--intro' : ''
                      }`}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, ease: CINEMATIC_EASE, delay: 0.08 }}
                    >
                      {m.id === 'welcome' ? (
                        <div className="ai-assistant__intro">
                          <p className="ai-assistant__intro-greeting">{WELCOME_GREETING}</p>
                          <p className="ai-assistant__intro-sub">{WELCOME_SUBLINE}</p>
                        </div>
                      ) : (
                        <p className="ai-assistant__bubble-text">{m.text.replaceAll('**', '')}</p>
                      )}
                    </motion.article>
                  </AssistantReply>
                ) : (
                  <motion.article
                    key={m.id}
                    className="ai-assistant__bubble ai-assistant__bubble--user"
                    initial={{ opacity: 0, y: 6, x: 4 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.24, ease: CINEMATIC_EASE }}
                  >
                    <p className="ai-assistant__bubble-text">{m.text}</p>
                  </motion.article>
                )
              )}

              {typingText ? (
                <AssistantReply streaming>
                  <motion.article
                    className="ai-assistant__bubble ai-assistant__bubble--assistant ai-assistant__bubble--streaming"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="ai-assistant__bubble-text">{typingText}</p>
                    <span className="ai-assistant__stream-cursor" aria-hidden />
                  </motion.article>
                </AssistantReply>
              ) : null}

              {thinking ? (
                <AssistantReply thinking>
                  <div className="ai-assistant__bubble ai-assistant__bubble--assistant ai-assistant__bubble--typing" aria-label="CSI Nova is typing">
                    <div className="ai-assistant__typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </AssistantReply>
              ) : null}
            </div>

            <div className="ai-assistant__quick-section">
              <p className="ai-assistant__quick-label">Quick actions</p>
              <div className="ai-assistant__quick" aria-label="Suggested quick actions">
                {suggestedActions.map((a) => (
                  <button key={a.id} type="button" className="ai-assistant__chip" onClick={() => onQuickAction(a)}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <form className="ai-assistant__input-row" onSubmit={onSubmit}>
              <div className="ai-assistant__input-wrap">
                <input
                  className="ai-assistant__input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message CSI Nova…"
                  aria-label="Ask AI assistant"
                />
                <span className="ai-assistant__input-glow" aria-hidden />
              </div>
              <button
                type="submit"
                className="ai-assistant__send"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
              >
                <Send size={18} strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`ai-assistant__orb-wrap${thinking ? ' ai-assistant__orb-wrap--thinking' : ''}${open ? ' ai-assistant__orb-wrap--open' : ''}`}
      >
        {!open && (
          <>
            <span className="ai-assistant__orb-ring ai-assistant__orb-ring--1" aria-hidden />
            <span className="ai-assistant__orb-ring ai-assistant__orb-ring--2" aria-hidden />
            <span className="ai-assistant__orb-ring ai-assistant__orb-ring--3" aria-hidden />
            <span className="ai-assistant__orb-scan" aria-hidden />
            <span className="ai-assistant__orb-particles" aria-hidden>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="ai-assistant__orb-particle" style={{ ['--oi' as string]: i } as CSSProperties} />
              ))}
            </span>
          </>
        )}

        <button
          type="button"
          className={`ai-assistant__orb${open ? ' ai-assistant__orb--close' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={open}
        >
          {!open && <span className="ai-assistant__orb-glow" aria-hidden />}
          {open ? (
            <X size={16} strokeWidth={2} />
          ) : (
            <NovaRobot size="lg" mood="idle" />
          )}
        </button>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
