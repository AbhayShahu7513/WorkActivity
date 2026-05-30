import csv
from django.http import HttpResponse
from openpyxl import Workbook
from .models import WorkSubmission

def export_submissions_csv(submissions_queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="submissions.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['ID', 'Category', 'Work', 'Submission Date', 'Submission Time', 'Total Photos'])
    
    for submission in submissions_queryset:
        writer.writerow([
            submission.id,
            submission.category.name if submission.category else 'N/A',
            submission.work.name if submission.work else 'N/A',
            submission.submission_date,
            submission.submission_time,
            submission.images.count()
        ])
    
    return response

def export_submissions_excel(submissions_queryset):
    wb = Workbook()
    ws = wb.active
    ws.title = "Work Submissions"
    
    headers = ['ID', 'Category', 'Work', 'Submission Date', 'Submission Time', 'Total Photos']
    ws.append(headers)
    
    for submission in submissions_queryset:
        ws.append([
            submission.id,
            submission.category.name if submission.category else 'N/A',
            submission.work.name if submission.work else 'N/A',
            str(submission.submission_date),
            str(submission.submission_time),
            submission.images.count()
        ])
    
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="submissions.xlsx"'
    wb.save(response)
    return response