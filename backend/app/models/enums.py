import enum

class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class AccessTier(str, enum.Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class OrganizationRole(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"

