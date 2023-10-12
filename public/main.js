document.addEventListener('DOMContentLoaded', function () {
    const refButton = document.getElementById('ref');
    
    refButton.addEventListener('click', function () {
        document.getElementById('pfurnizor').value = '';
        document.getElementById('flexRadioDefault1').checked = false;
        document.getElementById('flexRadioDefault2').checked = false;
        document.getElementById('pvanzare').value = '0,00';
    });

    const pfurnizorInput = document.getElementById('pfurnizor');
    const pvanzareInput = document.getElementById('pvanzare');

    pvanzareInput.setAttribute('readonly', 'readonly');

    pfurnizorInput.addEventListener('input', function () {
        calculatePretVanzare();
    });

    const option1Radio = document.getElementById('flexRadioDefault1');
    const option2Radio = document.getElementById('flexRadioDefault2');

    option1Radio.addEventListener('change', function () {
        calculatePretVanzare();
    });

    option2Radio.addEventListener('change', function () {
        calculatePretVanzare();
    });

    function convertPunctInVirgula(text) {
        // Conversie punct în virgulă
        return text.replace(/\./g, ',');
    }

    function calculatePretVanzare() {
        let pfurnizorValue = convertPunctInVirgula(pfurnizorInput.value); // Conversie pct in virgula.
        pfurnizorValue = parseFloat(pfurnizorValue);

        const option1Checked = option1Radio.checked;
        const option2Checked = option2Radio.checked;

        if (isNaN(pfurnizorValue) || (!option1Checked && !option2Checked)) {
            pvanzareInput.value = "0,00";
            pvanzareInput.style.opacity = "0.7";
            return;
        }

        if (option1Checked) {
            pfurnizorValue /= 1.19;
        }

        let adaosComercial = 0;

        if (pfurnizorValue >= 2000) {
            adaosComercial = 0.05; // 5%
        } else if (pfurnizorValue >= 1500) {
            adaosComercial = 0.10; // 10%
        } else if (pfurnizorValue >= 1000) {
            adaosComercial = 0.15; // 15%
        } else if (pfurnizorValue >= 500) {
            adaosComercial = 0.20; // 20%
        } else if (pfurnizorValue > 20) {
            adaosComercial = 0.25; // 25%
        } else if (pfurnizorValue > 0){
            adaosComercial = 0.30; // 30%
            pvanzareInput.value = '26,05'; 
            return; 
        }

        let pretVanzare = pfurnizorValue * (1 + adaosComercial);

        pretVanzare = pretVanzare * 1.19;
        
        pretVanzare = Math.ceil(pretVanzare);

        pretVanzare = pretVanzare / 1.19;

        pretVanzare = pretVanzare.toFixed(2).replace(".", ",");

        pvanzareInput.value = pretVanzare;
    }

    
    refButton.click();      // Reset pagina
});

document.getElementById("Copiaza").addEventListener("click", function() {
    var textToCopy = document.getElementById("pvanzare");
    textToCopy.select();
    document.execCommand("copy");
});

