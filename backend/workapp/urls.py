from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Public endpoints
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('submit/', views.PublicSubmissionView.as_view(), name='submit'),
    
    # Auth endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Admin endpoints
    path('submissions/', views.SubmissionListView.as_view(), name='submissions'),
    path('submissions/<int:id>/', views.SubmissionDetailView.as_view(), name='submission-detail'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    path('export/csv/', views.export_csv, name='export-csv'),
    path('export/excel/', views.export_excel, name='export-excel'),
]