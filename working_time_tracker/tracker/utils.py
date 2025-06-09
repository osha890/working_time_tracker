from io import BytesIO

import openpyxl
from openpyxl.styles import Font


def generate_xlsx_report(report_data):
    wb = openpyxl.Workbook()
    ws = wb.active

    headers = ["User ID", "Username", "Task ID", "Task Title", "Status", "Total Time"]
    ws.append(headers)

    for col in ws.iter_cols(min_row=1, max_row=1, min_col=1, max_col=len(headers)):
        for cell in col:
            cell.font = Font(bold=True)

    for entry in report_data:
        user_id = entry["user"]["id"]
        username = entry["user"]["username"]
        for task_info in entry["tasks"]:
            task_id = task_info["task"]["id"]
            task_title = task_info["task"]["title"]
            for status_info in task_info["statuses"]:
                status = status_info["status"]
                total_time = status_info["total_time"]
                ws.append([user_id, username, task_id, task_title, status, total_time])

    memory_object = BytesIO()
    wb.save(memory_object)
    memory_object.seek(0)
    return memory_object
