from rest_framework import serializers
from .models import Category, Work, WorkSubmission, SubmissionImage

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    works = WorkSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'works']

class SubmissionImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SubmissionImage
        fields = ['id', 'image', 'image_url', 'uploaded_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None

class WorkSubmissionListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    work_name = serializers.CharField(source='work.name', read_only=True)
    total_photos = serializers.SerializerMethodField()
    submission_date = serializers.DateField(read_only=True)
    submission_time = serializers.TimeField(read_only=True)

    class Meta:
        model = WorkSubmission
        fields = ['id', 'category_name', 'work_name', 'total_photos', 
                 'submission_date', 'submission_time', 'created_at']

    def get_total_photos(self, obj):
        return obj.images.count()

class WorkSubmissionDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    work = WorkSerializer(read_only=True)
    images = SubmissionImageSerializer(many=True, read_only=True)
    submission_date = serializers.DateField(read_only=True)
    submission_time = serializers.TimeField(read_only=True)

    class Meta:
        model = WorkSubmission
        fields = ['id', 'category', 'work', 'images', 'submission_date', 
                 'submission_time', 'created_at', 'updated_at']

class CreateSubmissionSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = WorkSubmission
        fields = ['category', 'work', 'images']

    def create(self, validated_data):
        images = validated_data.pop('images')
        submission = WorkSubmission.objects.create(**validated_data)
        for image in images:
            SubmissionImage.objects.create(submission=submission, image=image)
        return submission