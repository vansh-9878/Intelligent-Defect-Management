def build_defect_email(defect: dict, duplicate_info: dict | None = None):
    subject = f"[IDMP] New Defect Assigned - {defect['title']}"

    body = f"""
New defect has been assigned to your team.

------------------------------
DEFECT DETAILS
------------------------------
ID: {defect['id']}
Title: {defect['title']}
Severity: {defect.get('severity')}
Status: {defect.get('status')}
Module: {defect.get('module')}
Environment: {defect.get('environment')}

Description:
{defect.get('description')}

"""

    if duplicate_info:
        dup = duplicate_info.get("duplicate_details")

        body += "\n POSSIBLE DUPLICATE DETECTED\n"

        if dup:
            body += f"""
    Duplicate Defect Details:
    - ID: {dup.get('id')}
    - Title: {dup.get('title')}
    - Severity: {dup.get('severity')}
    - Status: {dup.get('status')}
    - Assigned Team: {dup.get('assigned_team')}
"""
    else:
        body += f"Duplicate Of: {duplicate_info.get('duplicate_of')}\n"

    body += f"Similarity Score: {duplicate_info.get('similarity_score')}\n"

    body += "\nPlease investigate and take necessary action.\n\n— IDMP System"

    return subject, body