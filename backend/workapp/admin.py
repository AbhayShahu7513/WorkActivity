from django.contrib import admin
from .models import Category, Work, WorkSubmission, SubmissionImage

admin.site.register(Category)
admin.site.register(Work)
admin.site.register(WorkSubmission)
admin.site.register(SubmissionImage)