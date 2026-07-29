let calcExpression = "";
let displayExpression = "";
document.getElementById('calc-result').textContent = '0';

function calcInput(val) {
    const funcMap = {
        'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(', 'sqrt': 'sqrt(',
        'log': 'log(', 'factorial': 'factorial(', 'pi': '3.14159265359', 'e': '2.718281828'
    };
    const displayMap = {
        'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(', 'sqrt': 'sqrt(',
        'log': 'log(', 'factorial': 'factorial('
    };
    if (funcMap[val]) { calcExpression += funcMap[val]; }
    else { calcExpression += val; }
    if (displayMap[val]) { displayExpression += displayMap[val]; }
    else if (val === 'factorial') { displayExpression += '!'; }
    else if (val === 'pow') { displayExpression += '^'; }
    else if (val === 'pi') { displayExpression += 'Pi'; }
    else if (val === 'e') { displayExpression += 'e'; }
    else { displayExpression += val; }
    document.getElementById('calc-expression').textContent = displayExpression;
}

function calcOp(op) {
    calcExpression += op;
    displayExpression += op;
    document.getElementById('calc-expression').textContent = displayExpression;
}

function calcClear() {
    calcExpression = '';
    displayExpression = '';
    document.getElementById('calc-result').textContent = '0';
    document.getElementById('calc-expression').textContent = '';
}

async function calcEqual() {
    try {
        const response = await fetch("/cal/api/calculate/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expression: calcExpression })
        });
        const data = await response.json();
        if (data.result !== undefined) {
            document.getElementById('calc-result').textContent = data.result;
            displayExpression = data.result.toString();
            calcExpression = '';
        } else {
            document.getElementById('calc-result').textContent = 'Error';
        }
    } catch (e) {
        document.getElementById('calc-result').textContent = 'Error';
    }
}
