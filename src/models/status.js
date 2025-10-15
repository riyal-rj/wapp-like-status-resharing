const statuses = {};

class Status {
    static create(userId, content) {
        const timestamp = Date.now();
        statuses[userId] = { content, timestamp };
        return { userId, content, timestamp };
    }

    static getByUserId(userId) {
        return statuses[userId];
    }

    static isValid(status) {
        if (!status) return false;
        const currentTime = Date.now();
        const elapsedTime = (currentTime - status.timestamp) / 1000; 
        return elapsedTime < 300; 
    }

    static reshare(originalUserId, resharingUserId) {
        const originalStatus = this.getByUserId(originalUserId);
        if (!originalStatus || !this.isValid(originalStatus)) {
            return null;
        }
        return this.create(resharingUserId, originalStatus.content);
    }
}

module.exports = Status;