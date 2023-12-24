const mje_inputs = `
<div class="ant-space-item css-byeoj0">
    <h3>Баллы за лекцию</h3>
    <input type="number" id="mje_l" class="css-byeoj0">
</div>
<div class="ant-space-item css-byeoj0">
    <h3>Баллы за практику</h3>
    <input type="number" id="mje_p" class="css-byeoj0">
</div>
<button class="ant-space-item css-byeoj0" type="button" id="mje_button">Рассчитать</button>
`

const lp_ids = {};

const process_row = (row) => {
    let points = 0;
    for (let pipikaka = 1; pipikaka < row.children.length; pipikaka++) {
        const pipikaka_para = row.children[pipikaka].textContent;
        if (pipikaka_para === "+" || pipikaka_para === "У") points += lp_ids[pipikaka];
    }
    if (row.children[0].children[0].innerText.includes("=>")) {
        row.children[0].children[0].innerText = row.children[0].children[0].innerText.split(" =>")[0]
    }
    row.children[0].children[0].innerText += ` => ${points}`;
}

const process_lp_ids = () => {
    const lp_rows = document.getElementsByTagName("thead")[0].children[0].children;
    let points_from_l = parseFloat(document.getElementById("mje_l").value);
    let points_from_p = parseFloat(document.getElementById("mje_p").value);
    for (let pipirow = 1; pipirow < lp_rows.length - 1; pipirow++) {
        const t = lp_rows[pipirow].children[0].textContent;
        lp_ids[pipirow] = t === "ЛК" ? points_from_l : points_from_p
    }
}

const render_inputs = () => {
    const second_child = document.getElementsByClassName("ant-space-item")[1];
    second_child.insertAdjacentHTML("afterend", mje_inputs);
    document.getElementById("mje_button").addEventListener("click", () => {
        process_lp_ids();
        const rows = document.getElementsByClassName("ant-table-row ant-table-row-level-0");
        for (let rowId = 0; rowId < rows.length; rowId++) {
            process_row(rows[rowId]);
        }
    })
}

let items;
let _intervalId = setInterval(() => {
    items = document.getElementsByClassName("ant-space-item");
    if (items.length < 2) return;
    clearInterval(_intervalId);
    render_inputs();
}, 1000);
