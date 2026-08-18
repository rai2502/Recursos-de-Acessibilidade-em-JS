# Sem Mouse, Sem Barreira — Squad 2 / Perfil Motor

Projeto de acessibilidade web que resolve um problema concreto de **navegação sem mouse**: quando um
componente interativo (modal, menu lateral, carrossel...) aparece na tela e o foco do teclado não é
controlado, o usuário que navega só com `Tab` fica "preso" ou "perdido" na página.

Este repositório implementa e demonstra, ao vivo, os três comportamentos que resolvem isso:

1. **Foco direcionado** — ao abrir o componente, o JavaScript move o foco para dentro dele com `.focus()`.
2. **Focus trap** — enquanto o componente está ativo, `Tab` e `Shift+Tab` circulam apenas entre os
   elementos internos, sem escapar para o resto da página.
3. **Saída com `Esc`** — a tecla `Escape` fecha o componente a qualquer momento e devolve o foco
   exatamente para o elemento que o abriu.

Os dois componentes de exemplo são um **modal de confirmação** e um **menu lateral expansível**,
ambos usando a mesma função reutilizável de focus trap (`criarFocusTrap`, em `js/script.js`).

## Tecnologias

- **HTML5** semântico (`role="dialog"`, `aria-modal`, `aria-expanded`, `aria-controls`, `aria-live`)
- **CSS3** puro (variáveis CSS, Grid, Flexbox, `prefers-reduced-motion`, `:focus-visible`)
- **JavaScript** puro (Vanilla JS, sem frameworks nem dependências)
- Fontes via Google Fonts: `Space Grotesk`, `Inter`, `JetBrains Mono`

Não há build step, bundler ou instalação de pacotes — é um site estático simples de propósito.

## Instalação

1. Baixe ou clone esta pasta para a sua máquina:
   ```bash
   git clone https://github.com/seu-usuario/squad2-perfil-motor.git
   cd squad2-perfil-motor
   ```
   *(ou apenas extraia o `.zip` recebido em uma pasta local)*

2. Abra a pasta no VS Code:
   ```bash
   code .
   ```

3. Não há dependências para instalar. Você só precisa de um navegador moderno (Chrome, Firefox, Edge
   ou Safari).

## Uso

### Opção A — abrir direto no navegador
Dê duplo clique em `index.html` (ou clique com o botão direito → *Abrir com* → seu navegador).

### Opção B — servidor local (recomendado, evita bloqueios de CORS em outros navegadores)
Se você usa a extensão **Live Server** do VS Code:
1. Clique com o botão direito em `index.html`.
2. Selecione **"Open with Live Server"**.

Ou, com Python instalado, rode no terminal dentro da pasta do projeto:
```bash
python3 -m http.server 8080
```
E acesse `http://localhost:8080` no navegador.

### Testando a acessibilidade (o objetivo do projeto)

1. Guarde o mouse.
2. Pressione `Tab` a partir do topo da página até focar no botão **"Excluir conta de teste"** e
   confirme com `Enter`.
3. Continue pressionando `Tab` repetidamente — repare que o foco nunca sai do modal, ele circula
   apenas entre os botões internos ("Cancelar" e "Sim, excluir").
4. Pressione `Esc` — o modal fecha e o foco volta exatamente para o botão que você usou para abri-lo.
5. Repita o mesmo teste com o botão **"Abrir menu lateral"** e observe o atributo `aria-expanded`
   mudando de `false` para `true` (visível nas DevTools, aba *Elements*).

```
Estrutura do projeto
├── index.html          → página principal (estrutura + os dois componentes)
├── css/
│   └── style.css        → identidade visual e estilos dos componentes
├── js/
│   └── script.js         → foco direcionado, focus trap e tecla Esc
└── README.md
```

## Contato / Autor

**Seu Nome**
- GitHub: [github.com/seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [linkedin.com/in/seu-usuario](https://linkedin.com/in/seu-usuario)
- E-mail: seuemail@exemplo.com

> Edite esta seção com seus próprios dados antes de publicar o repositório.
