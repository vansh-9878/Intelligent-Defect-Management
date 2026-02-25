SEVERITY_LABELS = {
    "CRITICAL": (
        "application crash system crash data loss security breach "
        "payment failure checkout failure service completely down "
        "production outage database corruption cannot proceed "
        "major business impact blocking all users"
    ),
    "HIGH": (
        "major feature not working functional failure important "
        "workflow broken api failure server error exception thrown "
        "user unable to complete important action significant bug"
    ),
    "MEDIUM": (
        "moderate functional issue partial feature not working "
        "unexpected behavior workaround available intermittent issue "
        "non blocking bug medium impact"
    ),
    "LOW": (
        "cosmetic issue ui bug alignment problem typo text issue "
        "visual glitch styling problem minor usability issue "
        "low impact cosmetic defect"
    ),
}


TEAM_LABELS = {
    "PAYMENTS": (
        "payment checkout billing transaction refund invoice "
        "credit card debit card wallet payment gateway"
    ),
    "AUTH": (
        "authentication login signup sign in oauth session "
        "password reset authorization access control"
    ),
    "FRONTEND": (
        "user interface ui frontend layout css styling "
        "react component visual display browser rendering"
    ),
    "BACKEND": (
        "api backend server database microservice endpoint "
        "business logic data processing service layer"
        "App crashing"
    ),
    "GENERAL": (
        "general issue miscellaneous other uncategorized bug"
    ),
}