def recommendations(Stage):
    x = {
        "R&D": {
            "AutoDesek Fusion 360": "Leads total users + rapid penetration growth in mid/SME manufacturing R&D - Cloud accessibility, integrated features, high new adoption",
            "SolidWorks": "High professional penetration + large installed base in mechanical R&D - Precision modeling, ecosystem loyalty, mid-large firm dominance",
            "Siemens NX": "Strong enterprise penetration in complex/high-end manufacturing R&D - Synchronous tech, digital thread/PLM scalability"
        },
        "Design": {
            "AutoDesek Fusion 360": "Massive total users + rapid penetration growth in SME/mid-market manufacturing design-Cloud accessibility, integrated CAD/CAM/CAE/generative, high new adoption",
            "SolidWorks": "High professional penetration + large installed base in mechanical manufacturing design-Precision parametric modeling, ecosystem loyalty, mid-large firm dominance",
            "Siemens NX": "Strong enterprise penetration in complex/high-end manufacturing design-Synchronous tech, digital thread/PLM scalability"
        },
        "Material Sourcing": {
            "SAP Ariba": "Highest total users via network + leading penetration/share in manufacturing procurement-Vast supplier ecosystem, e-sourcing/RFx, AI/compliance integration",
            "Coupa": "Strong enterprise users + high penetration in spend/sourcing for manufacturing-AI analytics, benchmarks, broad connectors",
            "Oracle  Procurement Cloud": "Solid users via Oracle ecosystem + strong enterprise penetration (Gartner Leader) in manufacturing sourcing-Embedded AI/analytics, integrated S2P, direct spend scalability"
        },
        "Packaging" : {
            "Loftware Spectrum": "Highest enterprise users + dominant penetration in manufacturing packaging labeling-Cloud-native unification, AI compliance, global scalability",
            "BarTender": "Massive installed users + broadest mid/large-firm adoption for packaging labels-Intelligent templates, secure automation, printer-agnostic integration",
            "NiceLabel": "Large legacy/cloud users + strong mid-market penetration in packaging-Intuitive designer, compliance wizards, rapid deployment"
        },
        "Quality&Testing" : {
            "Hexagon Q-DAS (qs-STAT)":"Global standard for statistical process control & plant-floor quality analytics-Real-time SPC, automotive-core analytics, MES/PLC connectivity, inline quality monitoring",
            "Minitab" : "Most widely used statistical quality engineering & Six Sigma platform-Advanced statistics, DOE, SPC, root-cause analytics, Six Sigma project management",
            "ETQ Reliance": "One of the most deployed enterprise-grade QMS platforms across manufacturing-Enterprise CAPA, audit workflows, risk management, cloud-native QMS, compliance automation"
        }
    }
    
    tools = x[Stage]
    formatted_string = f"\n=== Recommended Tools for {Stage} ===\n\n"
    for tool_name, description in tools.items():
        formatted_string += f"📌 {tool_name}\n\n   {description}\n\n"
    
    return formatted_string
