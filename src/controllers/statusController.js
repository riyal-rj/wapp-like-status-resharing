const Status = require('../models/status');

class StatusController {
    static postStatus(req, res) {
        const { userId, content } = req.body;
        const status = Status.create(userId, content);
        res.json({ 
            message: 'Status posted successfully!', 
            timestamp: status.timestamp 
        });
    }

    static checkStatus(req, res) {
        const userId = req.params.userId;
        const viewerId = req.query.viewerId; // optional: who is checking
        const status = Status.getByUserId(userId);

        if (!status) {
            return res.json({ 
                valid: false, 
                message: 'No status found for this user' 
            });
        }

        const isValid = Status.isValid(status);
        if (isValid) {
            // If a viewerId is supplied, record that they saw it
            if (viewerId) {
                Status.addViewer(userId, viewerId);
            }
            res.json({ 
                valid: true, 
                content: status.content 
            });
        } else {
            res.json({ 
                valid: false, 
                message: 'Status has expired' 
            });
        }
    }

    static reshareStatus(req, res) {
        const { originalUserId, resharingUserId } = req.body;
        const resharedStatus = Status.reshare(originalUserId, resharingUserId);

        if (resharedStatus) {
            res.json({ 
                message: 'Status re-shared successfully!', 
                timestamp: resharedStatus.timestamp 
            });
        } else {
            res.json({ 
                message: 'Original status not found or has expired, cannot re-share' 
            });
        }
    }

    static deleteStatus(req, res) {
        const { userId } = req.body;
        if (!userId) return res.json({ message: 'userId required' });
        const ok = Status.delete(userId);
        if (ok) return res.json({ message: 'Status deleted' });
        return res.json({ message: 'No status found to delete' });
    }

    static getViewers(req, res) {
        const userId = req.params.userId;
        const viewers = Status.getViewers(userId);
        res.json({ viewers });
    }
}

module.exports = StatusController;