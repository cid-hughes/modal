function Modal(options) {
    if (typeof options != "object") options = {};
    let defOpt = {
        id: "",
        className: "",
        heading: "",
        exit: "<button>X</button>",
        content: "Modal Content",
        actions: [
            { label: "OK", action: "modal.close();" }
        ],
        actionsInContent: true,
        fullScreen: true,
        onClick: "", /* this is an onClick event for root element, not a onClick event for the box element */
        onResize: "", /* this is a windows onResize event, not a modal onResize event */
        onScroll: "", /* this is a windows onScroll event, not a modal onScroll event */
        timeOut: 0
    };
    for (let option in defOpt) options[option] = options[option] !== undefined ? options[option] : defOpt[option];
    this.isRendered = false;
    if (options.onResize) this.onResize = options.onResize;
    if (options.onScroll) this.onScroll = options.onScroll;
    if (options.timeOut) this.timeOut = options.timeOut;
    /**************************************/
        let box;
    if (options.fullScreen) {
        this.e = document.createElement("div");
        if (options.id) e.id = options.id;
        this.e.classList.add("modal");
        if (options.className) this.e.classList.add(options.className);
        this.e.style.position = "fixed";
        this.e.style.top = this.e.style.left = "0";
        this.e.style.width = this.e.style.height = "100%";
        this.e.style.zIndex = "500";
        if (options.onClick) this.e.addEventListener("click", ()=>Function("modal", options.onClick)(this));
        /**************************************/
        box = document.createElement("div");
        box.classList.add("box");
        this.e.appendChild(box);
    } else {
        this.e = box = document.createElement("div");
        if (options.id) e.id = options.id;
        this.e.classList.add("modal", "box");
        if (options.className) this.e.classList.add(options.className);
        box.style.zIndex = "500";
    }
    /**************************************/
    let heading = document.createElement("div");
    if (options.heading) {
        heading.classList.add("heading");
        heading.innerHTML = options.heading;
        box.appendChild(heading);
    }
    /**************************************/
    let content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = options.content;
    box.appendChild(content);
    /**************************************/
    if (options.exit) {
        let exit = (new DOMParser()).parseFromString(options.exit, "text/html").firstChild.lastChild.firstChild;
        exit.classList.add("exit");
        exit.addEventListener("click", ()=>this.close());
        if (options.heading) {
            exit.style.float = "right";
            heading.insertBefore(exit, heading.firstChild);
        } else {
            exit.style.float = "right";
            content.insertBefore(exit, content.firstChild);
        }
    }
    /**************************************/
    if (Array.isArray(options.actions) && options.actions.length) {
        let actions = document.createElement("div");
        actions.classList.add("actions");
        options.actions.forEach(action=>{
            let button = document.createElement("button");
            button.innerHTML = action.label;
            button.addEventListener("click", ()=>Function("modal", action.action)(this));
            actions.appendChild(button);
        });
        if (options.actionsInContent) content.appendChild(actions);
        else box.appendChild(actions);
    }
}
/**************************************/
Modal.prototype.render = function(e) {
    if (this.isRendered) return;
    (e || document.body).appendChild(this.e);
    if (this.onResize) window.addEventListener("resize", ()=>Function("modal", this.onResize)(this));
    if (this.onScroll) window.addEventListener("scroll", ()=>Function("modal", this.onScroll)(this));
    if (this.timeOut) this._to = setTimeout(()=>this.close(), this.timeOut);
    this.isRendered = true;
}
Modal.prototype.close = function() {
    if (!this.isRendered) return;
    this.e.parentNode.removeChild(this.e);
    if (this.onResize) window.removeEventListener("resize", ()=>Function("modal", this.onResize)(this));
    if (this.onScroll) window.removeEventListener("scroll", ()=>Function("modal", this.onScroll)(this));
    if (this.timeOut) clearTimeout(this._to);
    this.isRendered = false;
}