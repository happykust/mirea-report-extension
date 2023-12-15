const mje_block = `
<div class="ant-space ant-space-horizontal css-byeoj0" id="mje-block">
    <button type="button" disabled class="ant-btn ant-space-item css-byeoj0 ant-btn-default ant-btn-lg ant-btn-block" id="mje-button" style="margin-right: 10px">
        <span id="mje-caption">[MJ] Ожидание данных...</span>
    </button>
</div>
`

let subjects = {};

const makeSelectElement = (current_subject) => {
    const selectEl = document.createElement("select");
    selectEl.setAttribute("id", "mje-select");
    selectEl.classList.add("ant-space-item")
    selectEl.style.minWidth = "200px";
    selectEl.style.textAlign = "center";

    const _node = document.createElement("option");
    _node.setAttribute("disabled", "");
    _node.setAttribute("selected", "");
    _node.setAttribute("value", "none");
    _node.innerText = "Выберите предмет...";
    selectEl.appendChild(_node);

    for (let subject in subjects) {
        if (subject === current_subject) continue;
        const _node = document.createElement("option");
        _node.setAttribute("value", subjects[subject]);
        _node.innerText = subject;
        selectEl.appendChild(_node);
    }
    return selectEl;
}

const processContainer = (container, drawerBody) => {
    document.getElementById("mje-caption").innerText = "[MJ] Обработка...";

    const clearSubjectName = document.getElementsByClassName("ant-drawer-title")[0].textContent;
    const subjectTime = drawerBody.children[0].children[0].children[0].children[0].textContent;
    const subjectName = clearSubjectName + subjectTime;

    let subject = subjects[subjectName];

    if (subject === undefined) {
        subjects[subjectName] = {};
        for (let el_index = 0; el_index < container.children.length; el_index++) {
            const el = container.children[el_index];
            const studentName = el.children[0].textContent;
            subjects[subjectName][studentName] = el.children[1].querySelector("input:checked").value;
        }
    }

    const selectEl = makeSelectElement(subjectName);

    if (drawerBody.children[1].children.length < 4) {
        document.getElementById("mje-caption").innerText = "[MJ] Уже заполнено";
    } else {
        document.getElementById("mje-caption").innerText = "[MJ] Заполнить как...";
        document.getElementById("mje-block").appendChild(selectEl);

        document.getElementById("mje-button").addEventListener("click", () => {
            console.log(subjects);
        });
        selectEl.addEventListener("change", (e) => {
            if (e.target.value !== "none") {
                document.getElementById("mje-button").removeAttribute("disabled");
            } else {
                document.getElementById("mje-button").setAttribute("disabled", "");
            }
        })
    }
}

const onRefresh = () => {
    let drawerBody = document.getElementsByClassName("ant-drawer-body");
    if (drawerBody.length === 0) return;
    drawerBody = drawerBody[0];

    drawerBody.children[1].children[0].insertAdjacentHTML("beforebegin", mje_block);

    let container;

    let _intervalId = setInterval(() => {
        container = document.getElementsByClassName("ant-spin-container")[0];
        if (container !== undefined && container.children.length < 3) return;
        clearInterval(_intervalId);
        processContainer(container, drawerBody);
    }, 1000);
}

const start = (arrows) => {
    for (let arrow_id = 0; arrow_id < arrows.length; arrow_id++) {
        arrows[arrow_id].addEventListener("click", () => {
            subjects = {};
            console.log("[MJ] Other day selected. Clearing subjects list.");
        });
    }

    const observer = new MutationObserver(onRefresh);
    observer.observe(document.getElementsByTagName("body")[0], {childList: true});

    console.log("[MJ] Extension loaded!");
}

let arrows;
let _intervalId = setInterval(() => {
    arrows = document.getElementsByClassName("ant-btn-icon-only");
    if (arrows.length === 0) return;
    clearInterval(_intervalId);
    start(arrows);
})
