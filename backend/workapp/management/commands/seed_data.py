from django.core.management.base import BaseCommand
from workapp.models import Category, Work

class Command(BaseCommand):
    help = 'Seed initial categories and works'

    def handle(self, *args, **kwargs):
        categories_data = {
            'Cleaning': ['Office Cleaning', 'Vehicle Cleaning', 'Washroom Cleaning', 'Floor Cleaning'],
            'Gardening': ['Water Plants', 'Grass Cutting', 'Tree Trimming', 'Fertilizer Application'],
            'Maintenance': ['Electrical Repair', 'Plumbing Work', 'Painting Work', 'Equipment Maintenance'],
            'Security': ['Patrol', 'CCTV Monitoring', 'Access Control', 'Emergency Response'],
            'Housekeeping': ['Dusting', 'Mopping', 'Waste Disposal', 'Linen Change']
        }
        
        for cat_name, works in categories_data.items():
            category, created = Category.objects.get_or_create(name=cat_name)
            for work_name in works:
                Work.objects.get_or_create(category=category, name=work_name)
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded categories and works'))