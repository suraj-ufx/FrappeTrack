import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def login(username: str, password: str) -> dict:
    """
    Authenticate the user's credentials.
    Args:
        username (str): username
        passowprd (str): password
    Returns:
        response: dict of json and user's details
    """
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=username, pwd=password)
        login_manager.post_login()

        return {
            "success": True,
            "token": frappe.session.sid,
            "user": frappe.session.user
        }

    except frappe.AuthenticationError:
        return {
            "success": False,
            "message": "Invalid username or password"
        }


