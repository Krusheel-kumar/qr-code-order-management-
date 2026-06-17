import re

with open('frontend/src/data/menu.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update MenuItem interface
interface_target = "badge?: string;\n}"
interface_replacement = "badge?: string;\n  recommendedToppings?: string[];\n}"
content = content.replace(interface_target, interface_replacement)

# 2. Add fallback recommendedToppings [t1] to all drinks that have flavorProfile
content = re.sub(r'(flavorProfile: \{[^}]+\},)', r'\1\n    recommendedToppings: [\'t1\'],', content)

# Specifically for fruity drinks
content = content.replace(
    "name: 'Strawberry Milk Tea',\n    recommendedToppings: ['t1'],\n    description:",
    "name: 'Strawberry Milk Tea',\n    recommendedToppings: ['t3', 't2'],\n    description:"
)
content = content.replace(
    "name: 'Mango Milk Tea',\n    recommendedToppings: ['t1'],\n    description:",
    "name: 'Mango Milk Tea',\n    recommendedToppings: ['t3', 't2'],\n    description:"
)
content = content.replace(
    "name: 'Sea Salt Biscoff',\n    recommendedToppings: ['t1'],\n    description:",
    "name: 'Sea Salt Biscoff',\n    recommendedToppings: ['t4'],\n    description:"
)

with open('frontend/src/data/menu.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added recommendedToppings to menu items")
