const {Op} = require("sequelize");

function prepareFilterCondition(filter){
    let condition = {
        [Op.and]: []
    };

    if (filter) {
        for (const [key, value] of Object.entries(filter)) {
            if(value){
                condition[Op.and].push({[key]: {[Op.iLike]: value + '%'}});
            }

        }
    }
    return condition;
}

module.exports = { prepareFilterCondition };