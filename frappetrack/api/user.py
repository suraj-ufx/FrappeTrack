import frappe
from frappetrack.utils.auth_utils import get_logged_in_user


@frappe.whitelist(allow_guest=True)
def get_profile():
    """
    Endpoint to get user's / employee profile details.
    """
    try:
        user_id = get_logged_in_user()

        user = frappe.get_doc("User", user_id)

        employee = frappe.db.get_value(
            "Employee",
            {"user_id": user.name},
            ["name", "designation"],
            as_dict=True
        )

        return {
            "success": True,
            "user": {
                "name": user.full_name,
                "email": user.email,
                "username": user.name,
                "employee": employee
            }
        }

    except Exception:
        return {
            "success": False,
            "message": "Unable to fetch profile"
        }
