/**
 * AI Chatbot Floating Widget
 * Embed: <script src="https://YOUR-VERCEL-URL/widget.js"></script>
 */
(function() {
  'use strict';

  // ============================================================
  // CONFIG — Update this URL per client
  // ============================================================
  const SCRIPT_TAG = document.currentScript;
  const BOT_URL = (SCRIPT_TAG && SCRIPT_TAG.getAttribute('data-bot')) || 'https://YOUR-CHATBOT-URL.vercel.app/';
  const TOOLTIP_TEXT = (SCRIPT_TAG && SCRIPT_TAG.getAttribute('data-tooltip')) || '👋 Need help? Chat now';
  const ACCENT_COLOR = (SCRIPT_TAG && SCRIPT_TAG.getAttribute('data-color')) || '#166534';
  const ACCENT_LIGHT = (SCRIPT_TAG && SCRIPT_TAG.getAttribute('data-color-light')) || '#4ade80';

  // ============================================================
  // STYLES
  // ============================================================
  const styles = `
    .cb-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_LIGHT});
      box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 0 ${ACCENT_LIGHT}80;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999998;
      transition: transform 0.2s ease;
      animation: cb-pulse 2.5s infinite;
      border: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 0;
    }
    .cb-launcher:hover { transform: scale(1.08); }
    .cb-launcher:active { transform: scale(0.95); }
    .cb-launcher svg { width: 28px; height: 28px; }
    .cb-launcher.cb-open svg { display: none; }
    .cb-launcher.cb-open::after {
      content: '×';
      color: white;
      font-size: 32px;
      font-weight: 300;
      line-height: 1;
    }
    .cb-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      border-radius: 50%;
      color: white;
      font-size: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }
    .cb-launcher.cb-open .cb-badge { display: none; }

    .cb-frame-wrap {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 400px;
      height: 640px;
      max-height: calc(100vh - 130px);
      max-width: calc(100vw - 48px);
      border-radius: 20px;
      box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.05);
      overflow: hidden;
      z-index: 999997;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      background: #0a0a0f;
    }
    .cb-frame-wrap.cb-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .cb-frame-wrap iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    .cb-tooltip {
      position: fixed;
      bottom: 36px;
      right: 96px;
      background: #1a1a2e;
      color: white;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 999998;
      opacity: 0;
      transform: translateX(8px);
      pointer-events: none;
      transition: opacity 0.3s ease 0.5s, transform 0.3s ease 0.5s;
      white-space: nowrap;
      max-width: calc(100vw - 130px);
    }
    .cb-tooltip.cb-show { opacity: 1; transform: translateX(0); }
    .cb-tooltip::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -6px;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-left: 6px solid #1a1a2e;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }

    @keyframes cb-pulse {
      0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 0 ${ACCENT_LIGHT}80; }
      50% { box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 12px ${ACCENT_LIGHT}00; }
    }

    @media (max-width: 480px) {
      .cb-frame-wrap {
        width: calc(100vw - 24px);
        height: calc(100vh - 110px);
        right: 12px;
        bottom: 90px;
        border-radius: 16px;
      }
      .cb-launcher { bottom: 16px; right: 16px; }
      .cb-tooltip { display: none; }
    }
  `;

  function init() {
    // Avoid double-injection
    if (window.__cbWidgetLoaded) return;
    window.__cbWidgetLoaded = true;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'cb-tooltip';
    tooltip.textContent = TOOLTIP_TEXT;
    document.body.appendChild(tooltip);

    // Launcher button
    const launcher = document.createElement('button');
    launcher.className = 'cb-launcher';
    launcher.setAttribute('aria-label', 'Open chat');
    launcher.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span class="cb-badge">1</span>';
    document.body.appendChild(launcher);

    // Iframe (lazy-loaded)
    const frameWrap = document.createElement('div');
    frameWrap.className = 'cb-frame-wrap';
    document.body.appendChild(frameWrap);

    let iframeLoaded = false;

    function openChat() {
      if (!iframeLoaded) {
        const iframe = document.createElement('iframe');
        iframe.src = BOT_URL;
        iframe.title = 'AI Assistant';
        iframe.allow = 'clipboard-write';
        frameWrap.appendChild(iframe);
        iframeLoaded = true;
      }
      frameWrap.classList.add('cb-open');
      launcher.classList.add('cb-open');
      tooltip.classList.remove('cb-show');
      const badge = launcher.querySelector('.cb-badge');
      if (badge) badge.style.display = 'none';
    }

    function closeChat() {
      frameWrap.classList.remove('cb-open');
      launcher.classList.remove('cb-open');
    }

    launcher.addEventListener('click', function() {
      if (frameWrap.classList.contains('cb-open')) closeChat();
      else openChat();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && frameWrap.classList.contains('cb-open')) closeChat();
    });

    setTimeout(function() {
      if (!frameWrap.classList.contains('cb-open')) {
        tooltip.classList.add('cb-show');
        setTimeout(function() { tooltip.classList.remove('cb-show'); }, 5000);
      }
    }, 3000);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
