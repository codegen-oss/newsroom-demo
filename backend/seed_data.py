import json
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserInterest, Organization, OrganizationMember
from auth import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        # Create users
        users = [
            {
                "email": "admin@example.com",
                "password": "password123",
                "display_name": "Admin User",
                "subscription_tier": "individual"
            },
            {
                "email": "user1@example.com",
                "password": "password123",
                "display_name": "Regular User",
                "subscription_tier": "free"
            },
            {
                "email": "org_admin@example.com",
                "password": "password123",
                "display_name": "Organization Admin",
                "subscription_tier": "organization"
            }
        ]
        
        created_users = []
        for user_data in users:
            user = User(
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                display_name=user_data["display_name"],
                subscription_tier=user_data["subscription_tier"]
            )
            db.add(user)
            db.flush()
            created_users.append(user)
        
        # Create user interests
        interests = [
            {
                "user_id": created_users[0].id,
                "categories": ["politics", "technology", "business"],
                "regions": ["North America", "Europe"],
                "topics": ["AI", "Climate Change", "Elections"]
            },
            {
                "user_id": created_users[1].id,
                "categories": ["sports", "entertainment"],
                "regions": ["Asia", "South America"],
                "topics": ["Movies", "Football", "Music"]
            },
            {
                "user_id": created_users[2].id,
                "categories": ["business", "finance"],
                "regions": ["Global", "Europe"],
                "topics": ["Startups", "Stock Market", "Cryptocurrency"]
            }
        ]
        
        for interest_data in interests:
            interest = UserInterest(
                user_id=interest_data["user_id"],
                categories=interest_data["categories"],
                regions=interest_data["regions"],
                topics=interest_data["topics"]
            )
            db.add(interest)
        
        # Create organizations
        organizations = [
            {
                "name": "Tech News Corp",
                "description": "Technology news organization",
                "subscription": {
                    "tier": "enterprise",
                    "seats": 10,
                    "billing_cycle": "monthly",
                    "price": 99.99
                }
            },
            {
                "name": "Global Media Group",
                "description": "International news organization",
                "subscription": {
                    "tier": "enterprise",
                    "seats": 25,
                    "billing_cycle": "annual",
                    "price": 999.99
                }
            }
        ]
        
        created_orgs = []
        for org_data in organizations:
            org = Organization(
                name=org_data["name"],
                description=org_data["description"],
                subscription=org_data["subscription"]
            )
            db.add(org)
            db.flush()
            created_orgs.append(org)
        
        # Create organization memberships
        memberships = [
            {
                "organization_id": created_orgs[0].id,
                "user_id": created_users[2].id,
                "role": "admin"
            },
            {
                "organization_id": created_orgs[0].id,
                "user_id": created_users[0].id,
                "role": "member"
            },
            {
                "organization_id": created_orgs[1].id,
                "user_id": created_users[2].id,
                "role": "admin"
            },
            {
                "organization_id": created_orgs[1].id,
                "user_id": created_users[1].id,
                "role": "member"
            }
        ]
        
        for membership_data in memberships:
            membership = OrganizationMember(
                organization_id=membership_data["organization_id"],
                user_id=membership_data["user_id"],
                role=membership_data["role"]
            )
            db.add(membership)
        
        db.commit()
        print("Data seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

