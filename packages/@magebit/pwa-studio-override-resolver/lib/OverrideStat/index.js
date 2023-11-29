const stat = {};

class OverrideStat {
    /**
     * @param oldPath
     * @param newPath
     */
    static store(oldPath, newPath) {
        Object.assign(stat, {
            [oldPath.replace(process.cwd(), '')]: newPath.replace(process.cwd(), '')
        });
    }

    /**
     * @returns {string}
     */
    static formatStat() {
        const overrideLog = Object.keys(stat).map(oldPath => `${oldPath} => ${stat[oldPath]}`).join('\n');
        return `\n${overrideLog}`;
    };
}

module.exports = OverrideStat;
