from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
from .models import Category, SubmissionImage, WorkSubmission
from .serializers import (
    CategorySerializer, CreateSubmissionSerializer, 
    WorkSubmissionListSerializer, WorkSubmissionDetailSerializer
)
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .utils import export_submissions_csv, export_submissions_excel

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('works').all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class PublicSubmissionView(generics.CreateAPIView):
    serializer_class = CreateSubmissionSerializer
    permission_classes = [AllowAny]

class SubmissionListView(generics.ListAPIView):
    serializer_class = WorkSubmissionListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = WorkSubmission.objects.select_related('category', 'work').prefetch_related('images')
        
        # Search
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(category__name__icontains=search) |
                Q(work__name__icontains=search)
            )
        
        # Filter by category
        category = self.request.query_params.get('category', '')
        if category:
            queryset = queryset.filter(category__name=category)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', '')
        end_date = self.request.query_params.get('end_date', '')
        
        if start_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d')
                queryset = queryset.filter(created_at__date__gte=start)
            except ValueError:
                pass
        
        if end_date:
            try:
                end = datetime.strptime(end_date, '%Y-%m-%d')
                queryset = queryset.filter(created_at__date__lte=end)
            except ValueError:
                pass
        
        return queryset.order_by('-created_at')

class SubmissionDetailView(generics.RetrieveDestroyAPIView):
    queryset = WorkSubmission.objects.prefetch_related('images')
    serializer_class = WorkSubmissionDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        submission = self.get_object()
        submission.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    total_submissions = WorkSubmission.objects.count()
    
    today = timezone.now().date()
    today_submissions = WorkSubmission.objects.filter(created_at__date=today).count()
    
    category_counts = WorkSubmission.objects.values('category__name').annotate(
        count=Count('id')
    ).order_by('-count')
    
    total_photos = SubmissionImage.objects.count()
    
    return Response({
        'total_submissions': total_submissions,
        'today_submissions': today_submissions,
        'category_counts': list(category_counts),
        'total_photos': total_photos
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_csv(request):
    submissions = WorkSubmission.objects.select_related('category', 'work').all()
    return export_submissions_csv(submissions)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_excel(request):
    submissions = WorkSubmission.objects.select_related('category', 'work').all()
    return export_submissions_excel(submissions)


class NoPagination(PageNumberPagination):
    page_size = None

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('works').all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None   # Disable pagination, return plain array