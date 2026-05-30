from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Work(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='works')
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class WorkSubmission(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    work = models.ForeignKey(Work, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def submission_date(self):
        return self.created_at.date()

    @property
    def submission_time(self):
        return self.created_at.time()

    def __str__(self):
        return f"Submission #{self.id} - {self.work.name if self.work else 'Unknown'}"

class SubmissionImage(models.Model):
    submission = models.ForeignKey(WorkSubmission, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='submissions/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for submission #{self.submission.id}"