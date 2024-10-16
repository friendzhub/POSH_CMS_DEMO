const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./posh_cases.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS posh_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT UNIQUE,
            complaint_datetime TEXT,
            acknowledged_within_3_hours BOOLEAN,
            priority TEXT,
            initial_meeting_date TEXT,
            meeting_completed_within_48_hours BOOLEAN,
            meeting_recorded BOOLEAN,
            meeting_not_recorded_reason TEXT,
            preliminary_action_datetime TEXT,
            preliminary_investigation_start_date TEXT,
            preliminary_investigation_end_date TEXT,
            preliminary_investigation_completed_in_4_days BOOLEAN,
            notice_of_explanation_sent_date TEXT,
            notice_sent_within_7_days BOOLEAN,
            respondent_reply_receive_date TEXT,
            respondent_reply_within_10_days BOOLEAN,
            inquiry_start_date TEXT,
            inquiry_end_date TEXT,
            p0_enquiry_completed_date TEXT,
            p0_enquiry_completed_within_2_weeks BOOLEAN,
            p1_enquiry_completed_date TEXT,
            p1_enquiry_completed_within_2_weeks BOOLEAN,
            inquiry_report_submission_date TEXT,
            recommended_actions TEXT,
            management_action_date TEXT,
            management_decision TEXT,
            appeal_filed BOOLEAN,
            appeal_decision TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err);
            }
        });
    }
});

// Routes
app.post('/api/create-case', (req, body) => {
    const caseId = `POSH-${Date.now()}`;
    const {
        complaint_datetime, acknowledged_within_3_hours, priority, initial_meeting_date,
        meeting_completed_within_48_hours, meeting_recorded, meeting_not_recorded_reason,
        preliminary_action_datetime, preliminary_investigation_start_date,
        preliminary_investigation_end_date, preliminary_investigation_completed_in_4_days,
        notice_of_explanation_sent_date, notice_sent_within_7_days,
        respondent_reply_receive_date, respondent_reply_within_10_days,
        inquiry_start_date, inquiry_end_date, p0_enquiry_completed_date,
        p0_enquiry_completed_within_2_weeks, p1_enquiry_completed_date,
        p1_enquiry_completed_within_2_weeks, inquiry_report_submission_date,
        recommended_actions, management_action_date, management_decision,
        appeal_filed, appeal_decision
    } = req.body;

    db.run(`INSERT INTO posh_cases (
        case_id, complaint_datetime, acknowledged_within_3_hours, priority,
        initial_meeting_date, meeting_completed_within_48_hours, meeting_recorded,
        meeting_not_recorded_reason, preliminary_action_datetime,
        preliminary_investigation_start_date, preliminary_investigation_end_date,
        preliminary_investigation_completed_in_4_days, notice_of_explanation_sent_date,
        notice_sent_within_7_days, respondent_reply_receive_date,
        respondent_reply_within_10_days, inquiry_start_date, inquiry_end_date,
        p0_enquiry_completed_date, p0_enquiry_completed_within_2_weeks,
        p1_enquiry_completed_date, p1_enquiry_completed_within_2_weeks,
        inquiry_report_submission_date, recommended_actions, management_action_date,
        management_decision, appeal_filed, appeal_decision
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [caseId, complaint_datetime, acknowledged_within_3_hours, priority,
     initial_meeting_date, meeting_completed_within_48_hours, meeting_recorded,
     meeting_not_recorded_reason, preliminary_action_datetime,
     preliminary_investigation_start_date, preliminary_investigation_end_date,
     preliminary_investigation_completed_in_4_days, notice_of_explanation_sent_date,
     notice_sent_within_7_days, respondent_reply_receive_date,
     respondent_reply_within_10_days, inquiry_start_date, inquiry_end_date,
     p0_enquiry_completed_date, p0_enquiry_completed_within_2_weeks,
     p1_enquiry_completed_date, p1_enquiry_completed_within_2_weeks,
     inquiry_report_submission_date, recommended_actions, management_action_date,
     management_decision, appeal_filed, appeal_decision],
    function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ caseId: caseId, message: "New POSH case created successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
