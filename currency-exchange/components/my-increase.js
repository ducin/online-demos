customElements.define('my-increase', class MyIncrease extends HTMLElement {
    styles() {
        return `
<style>
span {
    color: green;
    font-weight: bold;
    font-size: 30px;
}
</style>`;
    }
    render() {
        this.root.innerHTML = this.template();
    }
    connectedCallback() {
        this.root = this.attachShadow({ mode: 'open' });;
        this.render();
    }
    template() {
        return `${this.styles()}<span>⬆️</span>`; // ↗️
    }
});
