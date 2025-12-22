import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get_task_list()->dict:
    """
    Returns a list of open tasks.
    """
    try:
        tasks = frappe.db.get_list("Task", 
            fields=["name", "subject"], 
            filters={"status": "Open"}
        )

        if tasks:
            return {
                "status": "success",
                "data": tasks,
                "message": _("{0} Open tasks found.").format(len(tasks))
            }
        else:
            return {
                "status": "success",
                "data": [],
                "message": _("No open tasks found.")
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@frappe.whitelist(allow_guest=True)
def get_task_by_project(project: str):
    try:
        pass 
    except Exception:
        raise