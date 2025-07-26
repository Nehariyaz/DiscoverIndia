# activity_matcher.py

import re

activity_synonyms = {
    "trekking": [
        "hiking", "mountain walk", "nature walk", "trail walk", "mountain trekking", "adventure hike", "forest trek"
    ],
    "hiking": [
        "trekking", "mountain walk", "nature walk", "trail walk", "hill walk", "adventure hike"
    ],
    "kayaking": [
        "canoeing", "boating", "river adventure", "paddling", "whitewater"
    ],
    "beach": [
        "coast", "seaside", "sea", "beach trip", "sandy beach", "oceanfront", "sunbathing"
    ],
    "photography": [
        "photoshoot", "photo tour", "wildlife photography", "nature photography", "landscape photography", "travel photography", "shutterbug", "photo walk"
    ],
    "temple visit": [
        "temple", "pilgrimage", "spiritual", "heritage site", "religious trip", "shrine", "historical temple"
    ],
    "wildlife": [
        "safari", "bird watching", "nature reserve", "animal spotting", "wildlife sanctuary", "jungle safari", "nature safari", "fauna"
    ],
    "boat ride": [
        "cruise", "ferry", "lake ride", "boating", "houseboat", "backwater trip", "sailing"
    ],
    "water sports": [
        "swimming", "snorkeling", "diving", "surfing", "jet skiing", "parasailing", "windsurfing", "wake boarding", "paddle boarding"
    ],
    "camping": [
        "tented stay", "nature camping", "forest camping", "outdoor camping", "glamping", "wild camping"
    ],
    "cycling": [
        "biking", "mountain biking", "cycle tour", "bike ride", "bicycle tour"
    ],
    "rock climbing": [
        "climbing", "mountaineering", "bouldering", "adventure climb"
    ],
    "fishing": [
        "angling", "fly fishing", "deep sea fishing", "freshwater fishing", "sport fishing"
    ],
    "yoga": [
        "meditation", "wellness retreat", "spiritual retreat", "yoga camp", "mindfulness", "asana"
    ],
    "Ayurveda": [
        "wellness", "spa", "massage", "rejuvenation therapy", "detox"
    ],
    "food": [
        "culinary", "local cuisine", "food tour", "street food", "gastronomy", "cooking class"
    ],
    "shopping": [
        "bazaar", "market visit", "souvenir shopping", "artisan market", "fair"
    ],
    "paragliding": [
        "parasailing", "air adventure", "flying sports"
    ],
    "skiing": [
        "snow sports", "snowboarding", "winter sports"
    ],
    "horse riding": [
        "equestrian", "pony ride", "trail riding"
    ],
    "cultural festival": [
        "local festival", "folk festival", "fair", "carnival", "celebration", "music festival", "arts festival"
    ],
    "historical tour": [
        "heritage walk", "city tour", "history walk", "monuments tour"
    ],
    "nature": [
        "landscape", "scenic views", "nature walk", "wildlife", "outdoors", "natural beauty"
    ],
    "vineyard tour": [
        "wine tasting", "winery tour", "vineyard visit"
    ],
    "stargazing": [
        "astronomy", "night sky observation", "astronomy tour"
    ],
    "hot air balloon": [
        "balloon ride", "ballooning", "sky adventure"
    ],
    "surfing": [
        "waves", "board sports", "sea adventure"
    ],
    "road trip": [
        "self-drive", "car journey", "scenic drive"
    ],
}

def expand_activities(activities):
    """
    Given a list of activity names, expand them using the synonym dictionary.
    Returns a list of all synonym forms for matching.
    """
    expanded = set()
    for act in activities:
        act_lower = act.lower().strip()
        expanded.add(act_lower)
        # Add synonyms if present
        if act_lower in activity_synonyms:
            expanded.update(syn.lower() for syn in activity_synonyms[act_lower])
    return list(expanded)

def match_activities(user_activities, dest_activities):
    """
    Returns True if any expanded user activity matches any destination activity,
    using partial and token-overlap matching.
    """
    if not user_activities or not dest_activities:
        return False

    # Expand synonyms
    expanded_user_acts = expand_activities(user_activities)
    # Tokenize user activities for partial-match
    user_tokens = set()
    for act in expanded_user_acts:
        user_tokens.update(re.split(r"[\s,/-]+", act))
        user_tokens.add(act)  # for exact phrase match

    # Tokenize and check destination activities
    for dact in dest_activities:
        dact_lower = dact.lower().strip()
        dact_tokens = set(re.split(r"[\s,/-]+", dact_lower))
        # Check intersection with any user token
        if user_tokens & dact_tokens or dact_lower in user_tokens:
            return True
    return False
