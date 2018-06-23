const ethUtil = require("ethereumjs-util")
const rls = require("readline-sync")

class Reader {

    constructor(web3, program, defaultValues) {
        this.web3 = web3;
        this.eac = require('eac.js-lib')(this.web3);
        this.program = program;
        this.defaultValues = defaultValues;
    }

    readTemporalUnit() {
        let tempUnit;

        if (this.program.block) {
            tempUnit = 1;
        }
        else if (this.program.timestamp) {
            tempUnit = 2;
        }
        else {
            let response = rls.question('Would you like to schedule using blocks or timestamps as the unit?\n');
            response = response.toLocaleLowerCase();
            if (response === 'block' || response === 'blocks') {
                tempUnit = 1;
            }
            else if (response === 'timestamp' || response === 'timestamps') {
                tempUnit = 2;
            }
            else {
                throw new Error('Invalid response to question! Please response "block" or "timestamp"');
            }
        }
        return tempUnit;
    }

    readRecipientAddress() {
        let toAddress = rls.question('What is the recipeint address?\n');
        if (!toAddress) {
            toAddress = '0x0010f94b296A852aAac52EA6c5Ac72e03afD032D';
        }
        //Validate the address.
        toAddress = ethUtil.addHexPrefix(toAddress);
        if (!this.eac.Util.checkValidAddress(toAddress)) {
            throw new Error('Invalid recipient address.');
        }
        return toAddress;
    }

    readCallData() {
        let callData = rls.question('What is the callData?\n');
        if (!callData) {
            callData = '0x0';
        }
        callData = this.web3.toHex(callData);
        return callData;
    }

    readCallGas() {
        const callGas = rls.question('What is the callGas?\n');
        return callGas || this.defaultValues.callGas;
    }

    readCallValue() {
        const callValue = rls.question('What is the callValue?\n');
        return callValue || this.defaultValues.callValue;
    }

    readWindowSize() {
        const windowSize = rls.question('What is the windowSize?\n');
        return windowSize || this.defaultValues.windowSize;
    }

    readWindowStart(curBlockNum) {
        const defaultWindowStart = curBlockNum + this.defaultValues.minimumPeriodBeforeSchedule + 5;
        const windowStart = rls.question(`What is the windowStart: [press enter for ${defaultWindowStart}]\n`);
        return windowStart || defaultWindowStart;
    }

    readGasPrice() {
        const gasPrice = rls.question('What is the gasPrice?\n');
        return gasPrice || this.defaultValues.gasPrice;
    }

    readFee() {
        const fee = rls.question('What is the fee?\n');
        return fee || this.defaultValues.fee;
    }

    readBounty() {
        const bounty = rls.question('What is the bounty?\n');
        return bounty || this.defaultValues.bounty;
    }

    readDeposit() {
        const deposit = rls.question('What is the deposit?\n');
        return deposit || this.defaultValues.deposit;
    }
}

module.exports = Reader;