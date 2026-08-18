/**
 * =========================================================================
 * SQUAD 2 — PERFIL MOTOR: NAVEGAÇÃO SEM MOUSE
 * =========================================================================
 * Este arquivo implementa os 3 requisitos técnicos pedidos:
 *
 *   1) Controlar o foco do teclado via JavaScript usando .focus()
 *   2) Impedir que o foco saia do componente ativo ("Focus Trap")
 *   3) Fechar/cancelar o componente pressionando a tecla Escape
 *
 * A lógica foi escrita como uma função reutilizável (criarFocusTrap),
 * usada tanto pelo MODAL de confirmação quanto pelo MENU LATERAL,
 * para provar que o mesmo padrão serve para qualquer componente
 * "sobreposto" à página (modal, drawer, popover, etc).
 * ========================================================================= */

// Seletor de todos os elementos que podem receber foco por Tab
const SELETOR_FOCAVEIS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Cria um "focus trap" (prisão de foco) dentro de um container.
 * @param {HTMLElement} container - elemento que deve prender o foco (modal, menu, etc)
 * @param {HTMLElement} overlay - elemento de overlay que deve ficar oculto/visível
 * @param {Function} aoFechar - callback chamado quando o componente é fechado
 * @returns {{abrir: Function, fechar: Function}}
 */
function criarFocusTrap(container, overlay, aoFechar) {
  let elementoQueAbriu = null; // guarda quem estava focado antes de abrir

  function focaveisDoContainer() {
    return Array.from(container.querySelectorAll(SELETOR_FOCAVEIS))
      .filter(el => el.offsetParent !== null); // ignora elementos escondidos
  }

  // ---- REQUISITO 2: Focus trap -------------------------------------------
  function aoPressionarTecla(evento) {
    // REQUISITO 3: Esc sempre fecha o componente
    if (evento.key === 'Escape') {
      evento.preventDefault();
      fechar();
      return;
    }

    if (evento.key !== 'Tab') return;

    const focaveis = focaveisDoContainer();
    if (focaveis.length === 0) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    // Shift+Tab no primeiro elemento -> pula para o último (circular)
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    }
    // Tab no último elemento -> volta para o primeiro (circular)
    else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
    // Se o foco de alguma forma escapou do container, traz de volta
    else if (!container.contains(document.activeElement)) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  function abrir() {
    elementoQueAbriu = document.activeElement; // memoriza para restaurar depois

    overlay.hidden = false;
    document.body.style.overflow = 'hidden'; // trava o scroll de fundo

    // REQUISITO 1: foco direcionado para dentro do componente
    const focaveis = focaveisDoContainer();
    if (focaveis.length > 0) {
      focaveis[0].focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    document.addEventListener('keydown', aoPressionarTecla, true);
  }

  function fechar() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', aoPressionarTecla, true);

    // REQUISITO 1 (retorno): foco volta para quem abriu o componente
    if (elementoQueAbriu) {
      elementoQueAbriu.focus();
    }

    if (typeof aoFechar === 'function') aoFechar();
  }

  return { abrir, fechar };
}

// =========================================================================
// COMPONENTE 1 — MODAL DE CONFIRMAÇÃO
// =========================================================================
(function iniciarModal() {
  const overlay = document.getElementById('overlayModal');
  const modal = document.getElementById('modalConfirm');
  const botaoAbrir = document.getElementById('abrirModal');
  const botaoCancelar = document.getElementById('cancelarModal');
  const botaoConfirmar = document.getElementById('confirmarModal');
  const status = document.getElementById('liveStatus');

  const trap = criarFocusTrap(modal, overlay, () => {
    status.textContent = 'Modal fechado. Foco devolvido ao botão de abertura.';
  });

  botaoAbrir.addEventListener('click', () => {
    trap.abrir();
    status.textContent = 'Modal aberto. O foco está preso dentro dele — use Tab para conferir.';
  });

  botaoCancelar.addEventListener('click', trap.fechar);

  botaoConfirmar.addEventListener('click', () => {
    trap.fechar();
    status.textContent = 'Ação confirmada (simulação). Modal fechado e foco restaurado.';
  });

  // Clique fora do modal também fecha (bônus de usabilidade, não obrigatório)
  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) trap.fechar();
  });
})();

// =========================================================================
// COMPONENTE 2 — MENU LATERAL EXPANSÍVEL
// =========================================================================
(function iniciarMenuLateral() {
  const overlay = document.getElementById('overlayMenu');
  const menu = document.getElementById('menuLateral');
  const botaoAbrir = document.getElementById('abrirMenu');
  const botaoFechar = document.getElementById('fecharMenu');
  const status = document.getElementById('liveStatus');
  const linksDoMenu = menu.querySelectorAll('.side-menu__link');

  const trap = criarFocusTrap(menu, overlay, () => {
    botaoAbrir.setAttribute('aria-expanded', 'false');
    status.textContent = 'Menu lateral fechado. Foco devolvido ao botão de abertura.';
  });

  botaoAbrir.addEventListener('click', () => {
    trap.abrir();
    botaoAbrir.setAttribute('aria-expanded', 'true');
    status.textContent = 'Menu lateral aberto. aria-expanded agora é "true".';
  });

  botaoFechar.addEventListener('click', trap.fechar);

  // Ao clicar em um link do menu, fecha e deixa o navegador rolar até a âncora
  linksDoMenu.forEach(link => {
    link.addEventListener('click', () => trap.fechar());
  });

  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) trap.fechar();
  });
})();
