#!/usr/bin/env python3
"""
Kaggle Dataset Processing Script for Kids B-Care Object Explorer

This script processes various Kaggle datasets to extract and prepare data for the application:
1. Food nutrition datasets
2. Child-safe object datasets 
3. Object detection training data

Usage:
    python process_kaggle_data.py --dataset <dataset_name> --output <output_path>
"""

import argparse
import json
import pandas as pd
import numpy as np
from pathlib import Path
import requests
import zipfile
import os
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class KaggleDataProcessor:
    """Process Kaggle datasets for Kids B-Care application"""
    
    def __init__(self, output_dir: str = "../models"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Enhanced nutrition database with more foods
        self.nutrition_database = {
            # Fruits
            'apple': {
                'name': 'Apple', 'category': 'Fruits', 'emoji': '🍎',
                'nutrition': {'calories': 52, 'protein': 0.3, 'carbs': 14, 'fat': 0.2, 'fiber': 2.4, 'sugar': 10, 'sodium': 1, 'potassium': 107, 'calcium': 6, 'iron': 0.1, 'vitaminC': 4.6, 'vitaminA': 54},
                'benefits': ['Rich in fiber for healthy digestion', 'Contains antioxidants for strong immunity', 'Good source of vitamin C', 'Helps keep teeth clean and healthy'],
                'kidFriendly': {'description': 'Crunchy and sweet! Apples help keep your teeth strong and your tummy happy!', 'funFact': 'An apple a day keeps the doctor away! 🏥', 'healthScore': 9}
            },
            'banana': {
                'name': 'Banana', 'category': 'Fruits', 'emoji': '🍌',
                'nutrition': {'calories': 89, 'protein': 1.1, 'carbs': 23, 'fat': 0.3, 'fiber': 2.6, 'sugar': 12, 'sodium': 1, 'potassium': 358, 'calcium': 5, 'iron': 0.3, 'vitaminC': 8.7, 'vitaminB6': 0.4},
                'benefits': ['High in potassium for heart health', 'Natural energy boost from healthy sugars', 'Good source of vitamin B6', 'Contains fiber for digestion'],
                'kidFriendly': {'description': 'Sweet and creamy! Bananas give you energy to play and run around!', 'funFact': 'Bananas are berries, but strawberries are not! 🤯', 'healthScore': 8}
            },
            'orange': {
                'name': 'Orange', 'category': 'Fruits', 'emoji': '🍊',
                'nutrition': {'calories': 47, 'protein': 0.9, 'carbs': 12, 'fat': 0.1, 'fiber': 2.4, 'sugar': 9, 'sodium': 0, 'potassium': 181, 'calcium': 40, 'iron': 0.1, 'vitaminC': 53, 'folate': 40},
                'benefits': ['Excellent source of vitamin C', 'Boosts immune system', 'Contains folate for healthy growth', 'Rich in antioxidants'],
                'kidFriendly': {'description': 'Juicy and tangy! Oranges help fight off germs and keep you healthy!', 'funFact': 'One orange has more vitamin C than you need for the whole day! 💪', 'healthScore': 9}
            },
            # Vegetables
            'broccoli': {
                'name': 'Broccoli', 'category': 'Vegetables', 'emoji': '🥦',
                'nutrition': {'calories': 34, 'protein': 2.8, 'carbs': 7, 'fat': 0.4, 'fiber': 2.6, 'sugar': 1.5, 'sodium': 33, 'potassium': 316, 'calcium': 47, 'iron': 0.7, 'vitaminC': 89, 'vitaminK': 102, 'folate': 63},
                'benefits': ['Super high in vitamin C and K', 'Contains powerful antioxidants', 'Good source of fiber and protein', 'Supports bone health with calcium'],
                'kidFriendly': {'description': 'Like tiny green trees! Broccoli makes you super strong like a superhero!', 'funFact': 'Broccoli has more vitamin C than oranges! 🦸‍♂️', 'healthScore': 10}
            },
            'carrot': {
                'name': 'Carrot', 'category': 'Vegetables', 'emoji': '🥕',
                'nutrition': {'calories': 41, 'protein': 0.9, 'carbs': 10, 'fat': 0.2, 'fiber': 2.8, 'sugar': 4.7, 'sodium': 69, 'potassium': 320, 'calcium': 33, 'iron': 0.3, 'vitaminA': 835, 'vitaminC': 5.9},
                'benefits': ['Extremely high in vitamin A for eye health', 'Contains beta-carotene antioxidants', 'Good source of fiber', 'Supports healthy vision'],
                'kidFriendly': {'description': 'Orange and crunchy! Carrots help you see better, especially at night!', 'funFact': 'Eating carrots really can help you see in the dark! 👀', 'healthScore': 9}
            }
        }
        
        # Child-safe object categories
        self.child_safe_objects = {
            'toys': ['teddy bear', 'sports ball', 'kite', 'frisbee'],
            'educational': ['book', 'laptop', 'keyboard'],
            'household_safe': ['chair', 'couch', 'bed', 'dining table'],
            'animals': ['cat', 'dog', 'bird', 'horse'],
            'vehicles': ['car', 'truck', 'bus', 'bicycle', 'airplane'],
            'food': ['apple', 'banana', 'orange', 'broccoli', 'carrot', 'pizza', 'cake']
        }
        
        # Objects to avoid or flag for parental supervision
        self.restricted_objects = {
            'sharp_objects': ['knife', 'scissors'],
            'electrical': ['microwave', 'oven', 'toaster'],
            'potentially_unsafe': ['wine glass', 'bottle']
        }

    def download_dataset(self, dataset_url: str, extract_path: str) -> bool:
        """Download and extract dataset from URL"""
        try:
            logger.info(f"Downloading dataset from {dataset_url}")
            response = requests.get(dataset_url, stream=True)
            response.raise_for_status()
            
            zip_path = Path(extract_path) / "dataset.zip"
            zip_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(zip_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Extract zip file
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
            
            # Remove zip file
            zip_path.unlink()
            
            logger.info(f"Dataset downloaded and extracted to {extract_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error downloading dataset: {e}")
            return False

    def process_nutrition_dataset(self, dataset_path: str) -> Dict[str, Any]:
        """Process nutrition dataset and enhance with kid-friendly information"""
        try:
            # Try to read various common formats
            if dataset_path.endswith('.csv'):
                df = pd.read_csv(dataset_path)
            elif dataset_path.endswith('.json'):
                with open(dataset_path, 'r') as f:
                    data = json.load(f)
                df = pd.DataFrame(data)
            else:
                logger.warning(f"Unsupported file format: {dataset_path}")
                return {}
            
            logger.info(f"Processing nutrition dataset with {len(df)} entries")
            
            # Process and enhance nutrition data
            enhanced_nutrition = {}
            
            for _, row in df.iterrows():
                food_name = str(row.get('name', row.get('food', row.get('item', 'unknown')))).lower()
                
                # Skip if we already have this food in our database
                if food_name in self.nutrition_database:
                    enhanced_nutrition[food_name] = self.nutrition_database[food_name]
                    continue
                
                # Extract nutrition information
                nutrition_info = {
                    'name': food_name.title(),
                    'category': self._categorize_food(food_name),
                    'emoji': self._get_food_emoji(food_name),
                    'nutrition': {
                        'calories': float(row.get('calories', row.get('energy', 0))),
                        'protein': float(row.get('protein', 0)),
                        'carbs': float(row.get('carbohydrates', row.get('carbs', 0))),
                        'fat': float(row.get('fat', row.get('total_fat', 0))),
                        'fiber': float(row.get('fiber', row.get('dietary_fiber', 0))),
                        'sugar': float(row.get('sugar', row.get('sugars', 0))),
                        'sodium': float(row.get('sodium', 0)),
                        'potassium': float(row.get('potassium', 0)),
                        'calcium': float(row.get('calcium', 0)),
                        'iron': float(row.get('iron', 0)),
                        'vitaminC': float(row.get('vitamin_c', row.get('vitaminC', 0))),
                        'vitaminA': float(row.get('vitamin_a', row.get('vitaminA', 0)))
                    },
                    'kidFriendly': self._generate_kid_friendly_info(food_name)
                }
                
                enhanced_nutrition[food_name] = nutrition_info
            
            return enhanced_nutrition
            
        except Exception as e:
            logger.error(f"Error processing nutrition dataset: {e}")
            return {}

    def process_child_safety_dataset(self, dataset_path: str) -> Dict[str, Any]:
        """Process child safety dataset to categorize objects"""
        try:
            safety_data = {
                'safe_objects': [],
                'supervised_objects': [],
                'restricted_objects': [],
                'safety_guidelines': {}
            }
            
            # Add our predefined safe objects
            for category, objects in self.child_safe_objects.items():
                safety_data['safe_objects'].extend(objects)
                safety_data['safety_guidelines'][category] = {
                    'supervision_level': 'minimal',
                    'age_appropriate': '3+',
                    'safety_notes': f'Generally safe {category} for children'
                }
            
            # Add restricted objects
            for category, objects in self.restricted_objects.items():
                safety_data['restricted_objects'].extend(objects)
                safety_data['safety_guidelines'][category] = {
                    'supervision_level': 'required',
                    'age_appropriate': '12+',
                    'safety_notes': f'Requires adult supervision: {category}'
                }
            
            logger.info(f"Processed child safety data with {len(safety_data['safe_objects'])} safe objects")
            return safety_data
            
        except Exception as e:
            logger.error(f"Error processing child safety dataset: {e}")
            return {}

    def generate_class_labels(self) -> Dict[str, Any]:
        """Generate enhanced class labels with kid-friendly names and safety info"""
        # YOLO COCO classes
        coco_classes = [
            "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
            "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
            "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
            "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
            "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
            "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
            "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake",
            "chair", "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop",
            "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
            "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
        ]
        
        enhanced_labels = {}
        
        for i, class_name in enumerate(coco_classes):
            enhanced_labels[class_name] = {
                'id': i,
                'name': class_name,
                'kid_friendly_name': self._get_kid_friendly_name(class_name),
                'category': self._categorize_object(class_name),
                'safety_level': self._get_safety_level(class_name),
                'age_appropriate': self._get_age_appropriateness(class_name),
                'educational_value': self._get_educational_value(class_name),
                'has_nutrition_info': class_name in self.nutrition_database
            }
        
        return enhanced_labels

    def _categorize_food(self, food_name: str) -> str:
        """Categorize food items"""
        fruit_keywords = ['apple', 'banana', 'orange', 'berry', 'grape', 'melon']
        vegetable_keywords = ['broccoli', 'carrot', 'spinach', 'lettuce', 'tomato']
        protein_keywords = ['chicken', 'beef', 'fish', 'egg', 'bean']
        dairy_keywords = ['milk', 'cheese', 'yogurt', 'butter']
        grain_keywords = ['bread', 'rice', 'pasta', 'cereal']
        
        food_lower = food_name.lower()
        
        if any(keyword in food_lower for keyword in fruit_keywords):
            return 'Fruits'
        elif any(keyword in food_lower for keyword in vegetable_keywords):
            return 'Vegetables'
        elif any(keyword in food_lower for keyword in protein_keywords):
            return 'Proteins'
        elif any(keyword in food_lower for keyword in dairy_keywords):
            return 'Dairy'
        elif any(keyword in food_lower for keyword in grain_keywords):
            return 'Grains'
        else:
            return 'Other Foods'

    def _get_food_emoji(self, food_name: str) -> str:
        """Get appropriate emoji for food items"""
        emoji_map = {
            'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grape': '🍇',
            'strawberry': '🍓', 'watermelon': '🍉', 'pineapple': '🍍',
            'broccoli': '🥦', 'carrot': '🥕', 'corn': '🌽', 'tomato': '🍅',
            'bread': '🍞', 'cheese': '🧀', 'milk': '🥛', 'egg': '🥚',
            'pizza': '🍕', 'burger': '🍔', 'cake': '🍰', 'cookie': '🍪'
        }
        
        food_lower = food_name.lower()
        for key, emoji in emoji_map.items():
            if key in food_lower:
                return emoji
        
        return '🍽️'  # Default food emoji

    def _generate_kid_friendly_info(self, food_name: str) -> Dict[str, Any]:
        """Generate kid-friendly information for food items"""
        # This would ideally use AI or a comprehensive database
        # For now, we'll use simple rules
        
        healthy_foods = ['apple', 'banana', 'orange', 'broccoli', 'carrot', 'spinach']
        treat_foods = ['cake', 'cookie', 'candy', 'donut', 'ice cream']
        
        food_lower = food_name.lower()
        
        if any(healthy in food_lower for healthy in healthy_foods):
            return {
                'description': f'{food_name.title()} is super healthy and gives you energy to play!',
                'funFact': f'Did you know {food_name} helps keep you strong and healthy?',
                'healthScore': 9
            }
        elif any(treat in food_lower for treat in treat_foods):
            return {
                'description': f'{food_name.title()} is a yummy treat! Best enjoyed sometimes.',
                'funFact': f'{food_name.title()} is perfect for special celebrations!',
                'healthScore': 3
            }
        else:
            return {
                'description': f'{food_name.title()} is a food that gives you energy!',
                'funFact': f'Every food has something good for your body!',
                'healthScore': 6
            }

    def _categorize_object(self, obj_name: str) -> str:
        """Categorize objects for kids"""
        categories = {
            'Animals': ['cat', 'dog', 'bird', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'],
            'Toys': ['teddy bear', 'sports ball', 'kite', 'frisbee'],
            'Vehicles': ['car', 'truck', 'bus', 'bicycle', 'airplane', 'boat', 'train', 'motorcycle'],
            'Food': ['apple', 'banana', 'orange', 'broccoli', 'carrot', 'pizza', 'cake', 'hot dog'],
            'Household': ['chair', 'couch', 'bed', 'dining table', 'tv', 'laptop'],
            'School': ['book', 'backpack', 'laptop', 'keyboard'],
            'Nature': ['potted plant', 'tree', 'flower']
        }
        
        for category, items in categories.items():
            if obj_name in items:
                return category
        
        return 'Other Objects'

    def _get_safety_level(self, obj_name: str) -> str:
        """Determine safety level for objects"""
        safe_objects = ['teddy bear', 'book', 'apple', 'banana', 'chair', 'couch', 'sports ball']
        supervised_objects = ['knife', 'scissors', 'oven', 'microwave', 'wine glass']
        
        if obj_name in safe_objects:
            return 'safe'
        elif obj_name in supervised_objects:
            return 'supervised'
        else:
            return 'caution'

    def _get_age_appropriateness(self, obj_name: str) -> str:
        """Get age appropriateness for objects"""
        toddler_safe = ['teddy bear', 'sports ball', 'book', 'apple', 'banana']
        school_age = ['bicycle', 'laptop', 'keyboard', 'backpack']
        teen_plus = ['knife', 'scissors', 'wine glass']
        
        if obj_name in toddler_safe:
            return '2+'
        elif obj_name in school_age:
            return '6+'
        elif obj_name in teen_plus:
            return '13+'
        else:
            return '3+'

    def _get_educational_value(self, obj_name: str) -> str:
        """Determine educational value of objects"""
        high_educational = ['book', 'laptop', 'keyboard', 'apple', 'broccoli']
        medium_educational = ['car', 'airplane', 'cat', 'dog', 'chair']
        
        if obj_name in high_educational:
            return 'high'
        elif obj_name in medium_educational:
            return 'medium'
        else:
            return 'low'

    def _get_kid_friendly_name(self, obj_name: str) -> str:
        """Get kid-friendly names for objects"""
        friendly_names = {
            'cell phone': 'phone',
            'dining table': 'table',
            'potted plant': 'plant',
            'wine glass': 'glass',
            'hot dog': 'hotdog',
            'teddy bear': 'teddy',
            'sports ball': 'ball',
            'hair drier': 'hair dryer'
        }
        
        return friendly_names.get(obj_name, obj_name)

    def export_data(self, data: Dict[str, Any], filename: str) -> bool:
        """Export processed data to JSON file"""
        try:
            output_path = self.output_dir / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Data exported to {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error exporting data: {e}")
            return False

    def process_all_datasets(self) -> bool:
        """Process all datasets and generate output files"""
        try:
            # Generate enhanced class labels
            logger.info("Generating enhanced class labels...")
            class_labels = self.generate_class_labels()
            self.export_data(class_labels, 'enhanced_class_labels.json')
            
            # Export nutrition database
            logger.info("Exporting nutrition database...")
            self.export_data(self.nutrition_database, 'nutrition_database.json')
            
            # Generate child safety data
            logger.info("Generating child safety data...")
            safety_data = self.process_child_safety_dataset('')
            self.export_data(safety_data, 'child_safety_data.json')
            
            # Create summary report
            summary = {
                'total_classes': len(class_labels),
                'nutrition_items': len(self.nutrition_database),
                'safe_objects': len(safety_data['safe_objects']),
                'restricted_objects': len(safety_data['restricted_objects']),
                'processing_date': pd.Timestamp.now().isoformat(),
                'version': '1.0.0'
            }
            
            self.export_data(summary, 'dataset_summary.json')
            
            logger.info("All datasets processed successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Error processing datasets: {e}")
            return False

def main():
    """Main function to run the dataset processor"""
    parser = argparse.ArgumentParser(description='Process Kaggle datasets for Kids B-Care')
    parser.add_argument('--output', '-o', default='../models', help='Output directory')
    parser.add_argument('--dataset', '-d', help='Specific dataset to process')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Initialize processor
    processor = KaggleDataProcessor(args.output)
    
    # Process datasets
    success = processor.process_all_datasets()
    
    if success:
        print("✅ Dataset processing completed successfully!")
        print(f"📁 Output files saved to: {processor.output_dir}")
        print("📋 Generated files:")
        print("   - enhanced_class_labels.json")
        print("   - nutrition_database.json") 
        print("   - child_safety_data.json")
        print("   - dataset_summary.json")
    else:
        print("❌ Dataset processing failed!")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
