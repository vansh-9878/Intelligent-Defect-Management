import aiosmtplib
from email.message import EmailMessage
from src.core.email_config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
from src.utils.email_templates import build_defect_email



TEAM_EMAILS = {
    "PAYMENTS": ["vanshlongani05@gmail.com"],
    "AUTH": ["vanshlongani05@gmail.com"],
    "FRONTEND": ["vanshlongani05@gmail.com"],
    "BACKEND": ["vanshlongani05@gmail.com"],
    "GENERAL": ["vanshlongani05@gmail.com"],
}


async def send_email(to_emails: list[str], subject: str, body: str):
    message = EmailMessage()
    message["From"] = FROM_EMAIL
    message["To"] = ", ".join(to_emails)
    message["Subject"] = subject
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASS,
    )



async def notify_defect_created(defect: dict, duplicate_info: dict | None = None):
    team = defect.get("assigned_team", "GENERAL")
    recipients = TEAM_EMAILS.get(team, TEAM_EMAILS["GENERAL"])

    subject, body = build_defect_email(defect, duplicate_info)

    await send_email(recipients, subject, body)