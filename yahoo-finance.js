// ==UserScript==
// @name         Yahoo finance display totals
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://finance.yahoo.com/portfolio/*/view/v2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';

    function buildComponentFooterOverlay(gains, dividends, currency) {
        let customScript = document.createElement("custom-script")
        customScript.innerHTML =
            `<div class='float-message'>
              <div class='float-message-inner'>
                <p class="${dividends > 0 ? 'positive' : 'negative'}"><strong>Dividends: </strong><span>${currency}${dividends.toFixed(2)}</span></p>
                <p class="${gains > 0 ? 'positive' : 'negative'}"><strong>Gains: </strong><span>${currency}${gains.toFixed(2)}</span></p>
                <hr>
                <p class="${dividends + gains > 0 ? 'positive' : 'negative'}"><strong>Total: </strong><span>${currency}${(dividends + gains).toFixed(2)}</span></p>
              </div>
            </div>
            <style>
            .float-message {
                    position:fixed;
                    z-index:1001;
                    max-width:400px;
                    bottom:20px;
                    right:20px;
                    padding:30px;
                    color:#444;
                    font-size:16px;
                    border-radius:5px;
                    background:#FFF;
                    box-shadow:0px 5px 10px rgba(0,0,0,0.5);
                }
            .float-message-inner { position:relative; }
            .float-message-inner span { float: right}
            .close-link {
                    text-decoration:none;
                    color:#444;
                    font-weight:bold;
                    position:absolute;
                    top:-15px;
                    right:-15px;
                    font-size:18px;
                }
            .negative { color: #d60a22 }
            .positive { color: #037b4b }
            </style>`
        document.body.appendChild(customScript);
    }

    const currency = document.evaluate(
        '//*[@id="Lead-3-Portfolios-Proxy"]/main/div[1]/div[1]/div/div[1]/span',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
    ).singleNodeValue.textContent.slice(0, 1);
    const tableRows = Array.from(document.getElementsByTagName("table")[0].rows);
    let sum = 0;
    let gains = 0;
    let dividends = 0;
    tableRows.forEach((row, i) => {
        if (row.cells.length !== 15 || i === 0) {
            return;
        }
        gains += parseFloat(row.cells[10].getElementsByTagName('div')[0].textContent);
        dividends += parseFloat(row.cells[11].getElementsByTagName('div')[0].textContent) || 0;
    })

    buildComponentFooterOverlay(gains, dividends, currency)
})();
