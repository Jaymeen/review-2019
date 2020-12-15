const getFrequency = function (cycle) {
    switch (cycle) {
        case 0: {
            return 'Never';
        }
        case 1: {
            return 'Every month';
        }
        case 2: {
            return 'Every 2 months';
        }
        case 3: {
            return 'Every 3 months';
        }
        case 4: {
            return 'Every 4 months';
        }
        case 6: {
            return 'Half-Yearly';
        }
        case 12: {
            return 'Yearly';
        }
        default: {
            return 'Never';
        }
    }
}

module.exports = getFrequency;