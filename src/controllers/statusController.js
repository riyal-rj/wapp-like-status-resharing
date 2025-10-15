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
        const status = Status.getByUserId(userId);

        if (!status) {
            return res.json({ 
                valid: false, 
                message: 'No status found for this user' 
            });
        }

        const isValid = Status.isValid(status);
        if (isValid) {
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
}

module.exports = StatusController;