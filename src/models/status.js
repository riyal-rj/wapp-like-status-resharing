const statuses = {};

class Status {
    // Create a status for a user. Also initializes viewers list.
    static create(userId, content) {
        const timestamp = Date.now();
        statuses[userId] = { content, timestamp, viewers: [] };
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

    // Re-share only if original is valid. New status has a fresh timestamp and empty viewers.
    static reshare(originalUserId, resharingUserId) {
        const originalStatus = this.getByUserId(originalUserId);
        if (!originalStatus || !this.isValid(originalStatus)) {
            return null;
        }
        return this.create(resharingUserId, originalStatus.content);
    }

    // Delete a status (owner action)
    static delete(userId) {
        if (statuses[userId]) {
            delete statuses[userId];
            return true;
        }
        return false;
    }

    // Mark that viewerId has viewed the user's status. Returns true if added.
    static addViewer(userId, viewerId) {
        const status = this.getByUserId(userId);
        if (!status || !this.isValid(status)) return false;
        if (!viewerId) return false;
        // do not add owner as viewer
        if (viewerId === userId) return false;
        if (!status.viewers) status.viewers = [];
        if (!status.viewers.includes(viewerId)) {
            status.viewers.push(viewerId);
            return true;
        }
        return false;
    }

    static getViewers(userId) {
        const status = this.getByUserId(userId);
        if (!status) return [];
        return status.viewers || [];
    }
}

module.exports = Status;