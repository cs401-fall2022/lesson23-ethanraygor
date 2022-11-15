module.exports = {
    numberOnly: function numberOnly(str){
        str = str.replace(/[^0-9]/g, "");
        return str.trim();
    }
}