import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db.database import SessionLocal, engine
from models.article import Article, Category, Tag, Base, AccessTier
import random
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

# Sample data
categories = [
    {"name": "Politics", "description": "Political news and analysis"},
    {"name": "Economy", "description": "Economic trends and financial news"},
    {"name": "Technology", "description": "Tech innovations and industry news"},
    {"name": "Science", "description": "Scientific discoveries and research"},
    {"name": "Health", "description": "Health and wellness information"},
    {"name": "Environment", "description": "Environmental news and climate change"},
]

tags = [
    {"name": "Breaking News"},
    {"name": "Analysis"},
    {"name": "Opinion"},
    {"name": "Interview"},
    {"name": "Feature"},
    {"name": "Investigation"},
    {"name": "Global"},
    {"name": "Local"},
    {"name": "Trending"},
    {"name": "In-depth"},
]

articles = [
    {
        "title": "Global Economic Summit Addresses Inflation Concerns",
        "content": """
        <p>World leaders gathered at the annual Global Economic Summit to address rising inflation rates affecting economies worldwide. The three-day conference, held in Geneva, Switzerland, brought together finance ministers, central bank governors, and economic experts from over 40 countries.</p>
        
        <p>The summit's primary focus was on coordinating monetary policies to combat inflation without triggering a global recession. Federal Reserve Chair Janet Powell emphasized the need for balanced approaches: "We must be vigilant against inflation while ensuring we don't overreact and stifle economic growth."</p>
        
        <p>European Central Bank President Christine Lagarde presented data showing inflation trends across different regions and proposed a framework for policy coordination. "No single country can effectively address inflation in isolation in our interconnected global economy," Lagarde stated.</p>
        
        <p>The summit concluded with a joint statement committing to information sharing and policy coordination, though specific targets varied by region. Economists remain divided on whether these measures will be sufficient to address the complex factors driving current inflation rates.</p>
        """,
        "summary": "World leaders coordinate monetary policies at the Global Economic Summit to address inflation without causing recession.",
        "author": "Sarah Chen",
        "access_tier": AccessTier.FREE,
        "categories": ["Economy", "Politics"],
        "tags": ["Global", "Analysis"],
    },
    {
        "title": "Breakthrough in Quantum Computing Achieves New Milestone",
        "content": """
        <p>Researchers at the Quantum Technology Institute have achieved a significant breakthrough in quantum computing stability, maintaining a quantum state for over 10 minutes - shattering the previous record of 39 seconds.</p>
        
        <p>The team, led by Dr. Hiroshi Tanaka, developed a novel cooling system that reduces interference from environmental factors. "Temperature fluctuations have been the primary obstacle in maintaining quantum coherence," explained Dr. Tanaka. "Our system creates an unprecedented stable environment for qubits."</p>
        
        <p>This breakthrough potentially solves one of the most significant challenges in quantum computing: maintaining quantum states long enough to perform complex calculations. Industry experts suggest this could accelerate the timeline for practical quantum computing applications by several years.</p>
        
        <p>Tech companies are already responding to the news. QuantumTech announced increased funding for their quantum division, while Google's quantum research team issued a statement calling the breakthrough "a potential inflection point for the entire field."</p>
        
        <p>The research team has published their findings in the journal Science and made their methodology available to other researchers to replicate and build upon their work.</p>
        """,
        "summary": "Scientists achieve record-breaking quantum state stability, potentially accelerating quantum computing development.",
        "author": "Marcus Wong",
        "access_tier": AccessTier.PREMIUM,
        "categories": ["Technology", "Science"],
        "tags": ["Breaking News", "Innovation"],
    },
    {
        "title": "New Climate Policy Framework Proposed Ahead of Global Summit",
        "content": """
        <p>A coalition of environmental scientists and policy experts has unveiled a comprehensive climate policy framework ahead of next month's International Climate Action Summit. The proposal, titled "Climate Resilience 2030," outlines specific targets and implementation strategies for nations to reduce carbon emissions while building economic resilience.</p>
        
        <p>The framework introduces a tiered approach to carbon reduction targets, acknowledging the varying capabilities and responsibilities of developed versus developing nations. It also proposes a global fund to support green technology transfer to emerging economies.</p>
        
        <p>"What makes this framework different is its practicality," said Dr. Elena Rodriguez, lead author of the proposal. "We've moved beyond aspirational goals to specific, actionable policies with clear implementation pathways."</p>
        
        <p>The proposal has already gained endorsements from several environmental organizations and a handful of nations, though major carbon emitters have yet to comment officially. Climate policy analysts note that the framework's emphasis on economic opportunities in green transitions may help broaden its appeal.</p>
        
        <p>The International Climate Action Summit, scheduled for next month in Nairobi, is expected to be a pivotal moment for global climate cooperation following several years of fragmented approaches.</p>
        """,
        "summary": "New 'Climate Resilience 2030' framework proposes practical policies for carbon reduction ahead of international summit.",
        "author": "James Peterson",
        "access_tier": AccessTier.FREE,
        "categories": ["Environment", "Politics"],
        "tags": ["Analysis", "Global"],
    },
    {
        "title": "Revolutionary Cancer Treatment Shows Promise in Clinical Trials",
        "content": """
        <p>A groundbreaking cancer treatment combining immunotherapy with targeted genetic modification has shown remarkable results in early clinical trials, according to researchers at Memorial Cancer Research Center.</p>
        
        <p>The treatment, known as CRISPR-enhanced Adoptive Cell Therapy (CACT), uses gene-editing technology to modify a patient's immune cells to more effectively target cancer cells while leaving healthy tissue untouched. In the Phase I trial involving 24 patients with advanced-stage lymphoma, 78% showed significant tumor reduction, with 45% experiencing complete remission.</p>
        
        <p>"These results exceed our most optimistic projections," said Dr. Aisha Patel, lead researcher on the trial. "Particularly encouraging is the durability of the response, with patients in remission showing no signs of recurrence after 14 months."</p>
        
        <p>The treatment builds on existing immunotherapy approaches but addresses previous limitations through precise genetic modifications that enhance immune cell persistence and tumor recognition. Side effects were described as manageable and less severe than traditional chemotherapy.</p>
        
        <p>While researchers caution that larger trials are needed, the medical community has responded with cautious optimism. The team plans to expand trials to include other cancer types, with a Phase II study already approved to begin next quarter.</p>
        """,
        "summary": "New CRISPR-enhanced cancer therapy shows 78% response rate in early trials, with nearly half of patients achieving complete remission.",
        "author": "Dr. Michael Rivera",
        "access_tier": AccessTier.ORGANIZATION,
        "categories": ["Health", "Science"],
        "tags": ["Breaking News", "Research"],
    },
    {
        "title": "Tech Giants Face New Antitrust Legislation in Senate Hearing",
        "content": """
        <p>Major technology companies faced intense questioning yesterday during a Senate hearing on proposed antitrust legislation aimed at limiting market dominance in the digital economy. The bipartisan bill, titled the Digital Market Competition Act, would establish new standards for determining market monopolization and grant regulators enhanced powers to break up companies that violate these standards.</p>
        
        <p>Representatives from five major tech corporations testified, arguing that the legislation would harm innovation and American competitiveness. "This bill takes a sledgehammer approach when surgical precision is needed," stated Maria Thompson, Chief Policy Officer at TechCorp.</p>
        
        <p>Senators from both parties pushed back, citing internal documents showing how these companies have systematically acquired potential competitors and engaged in preferential treatment of their own services. Senator James Harmon noted, "The evidence suggests these platforms are no longer just participants in the market—they have become the market itself."</p>
        
        <p>Consumer advocacy groups and smaller tech companies have voiced strong support for the legislation. "This represents our best chance to restore genuine competition to the digital marketplace," said Thomas Wu, founder of the Digital Rights Coalition.</p>
        
        <p>The bill has advanced further than previous attempts at tech regulation, reflecting growing bipartisan concern about concentrated power in the technology sector. A full Senate vote is expected next month.</p>
        """,
        "summary": "Senate hearing on new antitrust legislation challenges tech giants' market dominance with bipartisan support.",
        "author": "Alicia Washington",
        "access_tier": AccessTier.FREE,
        "categories": ["Technology", "Politics"],
        "tags": ["Analysis", "Regulation"],
    },
    {
        "title": "Global Supply Chain Disruptions Expected to Ease by Q3",
        "content": """
        <p>After nearly two years of significant disruptions, global supply chains are showing signs of stabilization, with experts projecting substantial improvements by the third quarter of this year, according to a comprehensive report released by the International Trade Commission.</p>
        
        <p>The report cites several factors contributing to the expected recovery, including the expansion of port capacity, normalization of shipping container availability, and the gradual resolution of labor shortages in key logistics sectors. Additionally, companies have implemented more robust supply chain management systems after vulnerabilities were exposed during recent disruptions.</p>
        
        <p>"We're seeing the results of both natural market adjustments and deliberate investments in supply chain resilience," explained Dr. Robert Chen, lead author of the report. "The acute phase of the crisis appears to be behind us, though certain sectors will experience lingering effects."</p>
        
        <p>Industries expected to see the most significant improvements include consumer electronics, automotive, and retail goods. However, specialized manufacturing components and certain raw materials may continue to face constraints due to geopolitical factors and concentrated production capacity.</p>
        
        <p>The report also notes that while delivery times and costs are improving, they are unlikely to return to pre-pandemic levels, as companies prioritize reliability over maximum efficiency in their supply chain strategies.</p>
        """,
        "summary": "International Trade Commission report predicts significant supply chain improvements by Q3, though with lasting structural changes.",
        "author": "Carlos Mendez",
        "access_tier": AccessTier.PREMIUM,
        "categories": ["Economy"],
        "tags": ["Analysis", "Global"],
    },
    {
        "title": "Renewable Energy Investments Reach Record High in First Quarter",
        "content": """
        <p>Global investments in renewable energy reached an unprecedented $114 billion in the first quarter of this year, representing a 36% increase from the same period last year, according to data released by CleanEnergy Finance.</p>
        
        <p>Solar power projects led the surge, accounting for nearly 45% of total investments, followed by wind energy at 30% and emerging technologies such as green hydrogen and advanced energy storage making up the remainder. Geographically, the Asia-Pacific region attracted the largest share of investments at 42%, followed by Europe (27%) and North America (21%).</p>
        
        <p>"We're witnessing an acceleration that exceeds even our most optimistic projections," said Emma Chen, Chief Analyst at CleanEnergy Finance. "The combination of falling technology costs, supportive policies, and growing corporate commitments to clean energy is creating powerful momentum."</p>
        
        <p>Particularly notable is the increasing participation of traditional energy companies, with oil and gas majors responsible for over $18 billion in renewable investments this quarter. Industry analysts suggest this represents a strategic pivot rather than merely diversification.</p>
        
        <p>The report also highlights the growing role of private equity in funding early-stage clean energy technologies, with venture capital investments in climate tech startups reaching $7.2 billion, nearly double the previous year's figure.</p>
        """,
        "summary": "Renewable energy investments surge 36% to record $114 billion in Q1, led by solar power and Asia-Pacific region.",
        "author": "Sophia Martinez",
        "access_tier": AccessTier.FREE,
        "categories": ["Environment", "Economy"],
        "tags": ["Trending", "Analysis"],
    },
    {
        "title": "Artificial Intelligence System Detects Early-Stage Alzheimer's with 94% Accuracy",
        "content": """
        <p>Researchers at the Neural Health Institute have developed an artificial intelligence system capable of detecting early-stage Alzheimer's disease with 94% accuracy, potentially enabling intervention years before symptoms become apparent.</p>
        
        <p>The AI system, named NeuroDetect, analyzes a combination of speech patterns, micro-expressions, and simple cognitive tasks performed during a standard 15-minute screening that can be administered in primary care settings. The system identifies subtle markers of cognitive decline that typically escape detection in conventional assessments.</p>
        
        <p>"Early detection has been the holy grail of Alzheimer's research," explained Dr. Samantha Lee, principal investigator. "This system could potentially identify the disease 5-7 years before clinical diagnosis, at a stage when emerging treatments are most effective and lifestyle interventions can have significant impact."</p>
        
        <p>The research team validated NeuroDetect using data from a longitudinal study of 4,500 participants over eight years. Importantly, the system demonstrated low false-positive rates of just 3%, addressing a major concern in early screening programs.</p>
        
        <p>The technology has been licensed to healthcare AI company Cogniscient, which is working with regulatory authorities to begin clinical implementation. Initial deployment is expected in memory clinics by early next year, with broader primary care applications to follow.</p>
        """,
        "summary": "New AI system detects early Alzheimer's with 94% accuracy years before symptoms appear, potentially revolutionizing treatment timing.",
        "author": "Dr. Jonathan Park",
        "access_tier": AccessTier.ORGANIZATION,
        "categories": ["Health", "Technology"],
        "tags": ["Innovation", "Research"],
    },
    {
        "title": "Urban Planning Revolution: 15-Minute City Concept Gains Global Traction",
        "content": """
        <p>The "15-minute city" urban planning concept is gaining significant momentum globally, with over 30 major cities now implementing elements of this approach that aims to create neighborhoods where all essential services are accessible within a 15-minute walk or bike ride.</p>
        
        <p>Paris has emerged as the leading proponent, with Mayor Anne Hidalgo transforming the city through expanded bike lanes, pedestrianized streets, and zoning changes that encourage mixed-use development. Early data shows a 15% reduction in car usage and increased local business revenue in neighborhoods that have implemented the concept.</p>
        
        <p>"This represents a fundamental shift in how we think about urban spaces," explained Professor Carlos Moreno of the Sorbonne, who pioneered the concept. "We're moving from segregated, car-centric design to human-scale neighborhoods that prioritize quality of life and sustainability."</p>
        
        <p>Cities including Melbourne, Portland, and Barcelona have adapted the approach to their specific contexts, while maintaining the core principle of decentralized urban services. Urban planners note that the concept has gained additional relevance following pandemic-related changes in work patterns and increased awareness of the importance of local community infrastructure.</p>
        
        <p>Critics have raised concerns about implementation costs and potential gentrification effects, though proponents argue that thoughtful policy design can mitigate these risks while delivering significant environmental and social benefits.</p>
        """,
        "summary": "The '15-minute city' concept is transforming urban planning in 30+ cities worldwide, reducing car usage and revitalizing local economies.",
        "author": "Elena Rodriguez",
        "access_tier": AccessTier.PREMIUM,
        "categories": ["Environment", "Economy"],
        "tags": ["Feature", "Trending"],
    },
    {
        "title": "Diplomatic Breakthrough Achieved in Regional Trade Negotiations",
        "content": """
        <p>After three years of tense negotiations, representatives from the Eastern Alliance trading bloc announced yesterday that they have reached a preliminary agreement on a comprehensive trade framework that would eliminate tariffs on over 85% of goods and establish new standards for digital commerce.</p>
        
        <p>The breakthrough came during the final round of talks in Singapore, where negotiators worked through several previously intractable issues related to agricultural subsidies and intellectual property protections. Chief negotiator Min-ho Park described the agreement as "balanced and forward-looking," noting that it includes provisions for labor rights and environmental standards that exceed those in previous regional trade pacts.</p>
        
        <p>The agreement would create a trading zone encompassing 780 million people and approximately 28% of global GDP. Economic analysts project it could boost regional economic growth by 0.5% annually over the next decade while significantly increasing cross-border investment.</p>
        
        <p>"This represents not just an economic agreement but a strategic realignment in the region," noted Dr. Amara Singh, professor of international relations at Oxford University. "It signals a commitment to multilateralism at a time when many feared a retreat to protectionism."</p>
        
        <p>The preliminary agreement now moves to a technical review phase before being submitted to member nations for ratification, a process expected to take 12-18 months.</p>
        """,
        "summary": "Eastern Alliance trading bloc reaches preliminary agreement eliminating tariffs on 85% of goods after three years of negotiations.",
        "author": "Richard Thompson",
        "access_tier": AccessTier.FREE,
        "categories": ["Politics", "Economy"],
        "tags": ["Breaking News", "Global"],
    },
]

def seed_database():
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_articles = db.query(Article).count()
        if existing_articles > 0:
            print("Database already contains data. Skipping seed operation.")
            return
        
        # Create categories
        db_categories = {}
        for category_data in categories:
            category = Category(name=category_data["name"], description=category_data["description"])
            db.add(category)
            db.flush()
            db_categories[category_data["name"]] = category
        
        # Create tags
        db_tags = {}
        for tag_data in tags:
            tag = Tag(name=tag_data["name"])
            db.add(tag)
            db.flush()
            db_tags[tag_data["name"]] = tag
        
        # Create articles
        for article_data in articles:
            # Create random published date within the last 30 days
            days_ago = random.randint(0, 30)
            published_at = datetime.now() - timedelta(days=days_ago)
            
            article = Article(
                title=article_data["title"],
                content=article_data["content"],
                summary=article_data["summary"],
                author=article_data["author"],
                access_tier=article_data["access_tier"],
                published_at=published_at,
                featured_image=f"https://source.unsplash.com/random/800x600?{article_data['categories'][0].lower()}"
            )
            
            # Add categories
            for category_name in article_data["categories"]:
                if category_name in db_categories:
                    article.categories.append(db_categories[category_name])
            
            # Add tags
            for tag_name in article_data["tags"]:
                if tag_name in db_tags:
                    article.tags.append(db_tags[tag_name])
            
            db.add(article)
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

