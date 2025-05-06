import os
import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import User, Article, Organization, OrganizationMember, UserInterest
from app.models import SubscriptionTier, AccessTier, UserRole
from app.auth.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

# Create a database session
db = SessionLocal()

def seed_users():
    # Check if users already exist
    existing_users = db.query(User).count()
    if existing_users > 0:
        print("Users already exist, skipping user seed")
        return
    
    # Create sample users
    users = [
        {
            "email": "free@example.com",
            "password": "password123",
            "display_name": "Free User",
            "subscription_tier": SubscriptionTier.free
        },
        {
            "email": "premium@example.com",
            "password": "password123",
            "display_name": "Premium User",
            "subscription_tier": SubscriptionTier.individual
        },
        {
            "email": "org@example.com",
            "password": "password123",
            "display_name": "Organization User",
            "subscription_tier": SubscriptionTier.organization
        }
    ]
    
    for user_data in users:
        hashed_password = get_password_hash(user_data["password"])
        user = User(
            email=user_data["email"],
            password_hash=hashed_password,
            display_name=user_data["display_name"],
            subscription_tier=user_data["subscription_tier"]
        )
        db.add(user)
    
    db.commit()
    print("Users seeded successfully")

def seed_articles():
    # Check if articles already exist
    existing_articles = db.query(Article).count()
    if existing_articles > 0:
        print("Articles already exist, skipping article seed")
        return
    
    # Create sample articles
    articles = [
        {
            "title": "Global Markets Reach All-Time High",
            "content": "Global markets have reached an all-time high today as investors react positively to recent economic data. The S&P 500 closed up 1.2% at 5,100, while the Nasdaq Composite gained 1.5% to reach 16,200.\n\nAnalysts attribute the rally to better-than-expected corporate earnings and signs that inflation may be cooling. \"We're seeing a perfect storm of positive factors,\" said Jane Smith, chief market strategist at Capital Investments. \"Corporate profits are strong, inflation appears to be moderating, and central banks are signaling a more dovish stance.\"\n\nTechnology stocks led the gains, with major tech companies seeing significant increases in their share prices. The rally was broad-based, however, with all 11 sectors of the S&P 500 finishing in positive territory.\n\nEconomists are cautiously optimistic about the outlook for the remainder of the year, though some warn that geopolitical tensions and potential supply chain disruptions could still pose risks to the global economy.",
            "summary": "Global stock markets hit record highs as investors react to positive economic data and strong corporate earnings.",
            "source": "Financial Times",
            "source_url": "https://www.ft.com",
            "author": "John Doe",
            "published_at": datetime.utcnow() - timedelta(days=1),
            "categories": ["business", "economy", "markets"],
            "access_tier": AccessTier.free,
            "featured_image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "title": "New AI Breakthrough Could Transform Healthcare",
            "content": "Researchers at Stanford University have announced a significant breakthrough in artificial intelligence that could revolutionize healthcare diagnostics. The new AI system, called MediScan, can detect early signs of disease from medical images with unprecedented accuracy.\n\nIn clinical trials, MediScan demonstrated a 97% accuracy rate in identifying early-stage cancers from CT scans, outperforming experienced radiologists who achieved an 86% accuracy rate. The system was trained on over 10 million anonymized medical images and uses a novel deep learning architecture.\n\n\"This represents a quantum leap in diagnostic capabilities,\" said Dr. Sarah Chen, lead researcher on the project. \"MediScan can detect subtle patterns that even the most experienced human eyes might miss.\"\n\nThe technology could significantly reduce diagnostic errors and enable earlier treatment of serious conditions. The research team is now working with regulatory authorities to bring the technology to hospitals and clinics.\n\nExperts believe this advancement could save millions of lives and billions in healthcare costs by enabling earlier interventions. The team plans to expand the system's capabilities to include other types of medical imaging, including MRIs and ultrasounds.",
            "summary": "Stanford researchers develop AI system that outperforms human doctors in detecting early-stage diseases from medical images.",
            "source": "Tech Innovate",
            "source_url": "https://www.techinnovate.com",
            "author": "Jane Smith",
            "published_at": datetime.utcnow() - timedelta(days=2),
            "categories": ["technology", "health", "science"],
            "access_tier": AccessTier.premium,
            "featured_image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "title": "Diplomatic Tensions Rise in South China Sea",
            "content": "Diplomatic tensions have escalated in the South China Sea following a series of naval exercises conducted by multiple countries in the disputed waters. The exercises, which involved warships from several nations, have raised concerns about potential military confrontations in the region.\n\nThe United States and its allies conducted joint naval drills in what they described as an effort to ensure freedom of navigation in international waters. China responded by launching its own military exercises, describing them as necessary to protect its territorial sovereignty.\n\nInternational relations experts warn that the situation could deteriorate if diplomatic channels fail to reduce tensions. \"We're seeing a dangerous game of brinkmanship,\" said Dr. Robert Lee, professor of international relations at Georgetown University. \"The risk of miscalculation or accidental confrontation is significant.\"\n\nSeveral Southeast Asian nations with competing claims in the South China Sea have called for restraint and urged all parties to adhere to international law, including the United Nations Convention on the Law of the Sea (UNCLOS).\n\nThe United Nations Security Council is expected to discuss the situation in an emergency session later this week. Diplomatic efforts to de-escalate tensions are ongoing, with several countries offering to mediate discussions between the primary parties involved.",
            "summary": "Naval exercises by multiple countries increase tensions in the disputed South China Sea region, raising concerns about potential conflicts.",
            "source": "Global Affairs Journal",
            "source_url": "https://www.globalaffairsjournal.com",
            "author": "Michael Chen",
            "published_at": datetime.utcnow() - timedelta(days=3),
            "categories": ["politics", "geopolitics"],
            "access_tier": AccessTier.organization,
            "featured_image": "https://images.unsplash.com/photo-1565963925-b8132fee5446?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "title": "Renewable Energy Investments Reach Record High",
            "content": "Global investments in renewable energy reached a record $500 billion in the past year, according to a new report by the International Energy Agency (IEA). This represents a 25% increase from the previous year and signals a significant acceleration in the transition to clean energy.\n\nSolar and wind power projects accounted for the majority of investments, with emerging markets showing particularly strong growth. China remained the largest investor in renewable energy, followed by the United States and the European Union.\n\n\"We're witnessing a fundamental shift in energy investment patterns,\" said Maria Rodriguez, executive director of the IEA. \"For the first time, investments in clean energy technologies exceeded those in fossil fuels on a global scale.\"\n\nThe report attributes the surge in renewable investments to falling technology costs, supportive government policies, and growing pressure from investors and consumers for companies to reduce their carbon footprints.\n\nDespite the positive trend, the IEA warns that current investment levels still fall short of what's needed to meet global climate goals. To limit global warming to 1.5 degrees Celsius above pre-industrial levels, annual clean energy investments would need to triple by 2030.\n\nThe report also highlights the growing role of private capital in financing the energy transition, with institutional investors increasingly allocating funds to renewable projects in search of stable, long-term returns.",
            "summary": "Global investments in renewable energy hit $500 billion, marking a significant shift away from fossil fuels toward clean energy sources.",
            "source": "Energy Monitor",
            "source_url": "https://www.energymonitor.com",
            "author": "Sarah Johnson",
            "published_at": datetime.utcnow() - timedelta(days=4),
            "categories": ["economy", "technology", "science"],
            "access_tier": AccessTier.free,
            "featured_image": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "title": "New Quantum Computing Milestone Achieved",
            "content": "Scientists at IBM Research have announced a significant breakthrough in quantum computing, achieving quantum advantage for a practical problem for the first time. The team's 127-qubit processor successfully solved a complex optimization problem that would take conventional supercomputers thousands of years to complete.\n\nThe problem involved optimizing supply chain logistics for a multinational corporation, taking into account thousands of variables and constraints. The quantum computer solved the problem in just 3.5 hours, demonstrating the practical potential of quantum computing for real-world business applications.\n\n\"This represents a watershed moment for quantum computing,\" said Dr. James Williams, head of quantum research at IBM. \"We've moved beyond theoretical advantages to demonstrate practical quantum supremacy for a commercially relevant problem.\"\n\nThe breakthrough leverages a new quantum algorithm specifically designed for optimization problems, which could have applications in finance, logistics, drug discovery, and materials science.\n\nWhile the technology is still in its early stages, industry experts believe this milestone will accelerate investment and development in the quantum computing sector. Several major corporations have already expressed interest in partnering with IBM to explore quantum solutions for their most challenging computational problems.\n\nThe research team is now working to scale up the technology and make it more accessible through cloud-based quantum computing services.",
            "summary": "IBM researchers achieve quantum advantage by solving a complex optimization problem thousands of times faster than conventional supercomputers.",
            "source": "Quantum Tech Review",
            "source_url": "https://www.quantumtechreview.com",
            "author": "David Lee",
            "published_at": datetime.utcnow() - timedelta(days=5),
            "categories": ["technology", "science", "business"],
            "access_tier": AccessTier.premium,
            "featured_image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            "title": "Global Climate Summit Ends with New Commitments",
            "content": "The annual Global Climate Summit concluded yesterday with participating nations announcing ambitious new commitments to reduce carbon emissions and combat climate change. The two-week conference, attended by representatives from 195 countries, focused on accelerating the implementation of the Paris Agreement goals.\n\nMajor economies, including the United States, China, and the European Union, pledged to cut carbon emissions by 50-55% by 2030 compared to 2005 levels, a significant increase from previous commitments. Developing nations also announced more aggressive targets, supported by a new $100 billion annual climate finance package from wealthy countries.\n\n\"This summit marks a turning point in global climate action,\" said United Nations Secretary-General Antonio Guterres. \"The commitments made here, if fully implemented, would put us on track to limit global warming to 1.8 degrees Celsius.\"\n\nThe summit also saw unprecedented participation from the private sector, with over 1,000 major corporations committing to net-zero emissions targets and divesting from fossil fuels.\n\nEnvironmental activists cautiously welcomed the new pledges but emphasized the need for concrete action and accountability mechanisms. \"Commitments are important, but what matters is implementation,\" said Greta Thunberg, who led a demonstration of 50,000 climate activists outside the summit venue.\n\nThe next steps include translating these commitments into national policies and establishing a robust international monitoring system to track progress toward emission reduction goals.",
            "summary": "World leaders announce stronger climate commitments at Global Climate Summit, with major economies pledging 50-55% emission cuts by 2030.",
            "source": "Climate News Network",
            "source_url": "https://www.climatenewsnetwork.com",
            "author": "Emma Wilson",
            "published_at": datetime.utcnow() - timedelta(days=6),
            "categories": ["politics", "science", "geopolitics"],
            "access_tier": AccessTier.organization,
            "featured_image": "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
    ]
    
    for article_data in articles:
        article = Article(**article_data)
        db.add(article)
    
    db.commit()
    print("Articles seeded successfully")

def seed_organizations():
    # Check if organizations already exist
    existing_orgs = db.query(Organization).count()
    if existing_orgs > 0:
        print("Organizations already exist, skipping organization seed")
        return
    
    # Get organization user
    org_user = db.query(User).filter(User.email == "org@example.com").first()
    if not org_user:
        print("Organization user not found, skipping organization seed")
        return
    
    # Create sample organization
    org = Organization(
        name="Global News Corp",
        subscription={
            "plan": "enterprise",
            "seats": 10,
            "features": ["full_access", "api_access", "custom_reports"]
        }
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    
    # Add user as admin
    member = OrganizationMember(
        organization_id=org.id,
        user_id=org_user.id,
        role=UserRole.admin
    )
    db.add(member)
    db.commit()
    
    print("Organizations seeded successfully")

def seed_user_interests():
    # Check if user interests already exist
    existing_interests = db.query(UserInterest).count()
    if existing_interests > 0:
        print("User interests already exist, skipping interests seed")
        return
    
    # Get users
    free_user = db.query(User).filter(User.email == "free@example.com").first()
    premium_user = db.query(User).filter(User.email == "premium@example.com").first()
    org_user = db.query(User).filter(User.email == "org@example.com").first()
    
    if not free_user or not premium_user or not org_user:
        print("Users not found, skipping interests seed")
        return
    
    # Create sample interests
    interests = [
        {
            "user_id": free_user.id,
            "categories": ["technology", "science"],
            "regions": ["US", "Europe"],
            "topics": ["innovation", "startups"]
        },
        {
            "user_id": premium_user.id,
            "categories": ["business", "economy", "markets"],
            "regions": ["Global", "Asia"],
            "topics": ["markets", "trade", "AI"]
        },
        {
            "user_id": org_user.id,
            "categories": ["politics", "geopolitics", "economy"],
            "regions": ["Global", "Middle East", "Europe"],
            "topics": ["diplomacy", "trade", "elections"]
        }
    ]
    
    for interest_data in interests:
        interest = UserInterest(**interest_data)
        db.add(interest)
    
    db.commit()
    print("User interests seeded successfully")

if __name__ == "__main__":
    try:
        seed_users()
        seed_articles()
        seed_organizations()
        seed_user_interests()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

