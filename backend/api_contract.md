1. Initial Page Load
When the app first loads, fetch the static configuration data to populate your base dropdowns.

Endpoint: GET /api/v1/base-config

Returns: Lists for sectors, personas, feature_categories, and the default_weights dictionary.

2. Cascading Data Selection
Because our tool data comes from large internal sources, we fetch it dynamically to keep the app lightning fast.

When user selects a Sector: Call GET /api/v1/stages?sector={SectorName} to get the list of lifecycle stages.

When user selects a Stage: Call GET /api/v1/tools?sector={SectorName}&stage={StageName} to get the list of available tools.

3. Weight Selection Modes
The user needs to assign importance weights to different categories. Handle the three modes as follows:

Static: Just use the default_weights from the base config.

User-Based: Allow the user to adjust sliders (ensuring they sum to 1.0), and send those custom weights to the generation endpoints.

Dynamic (AI Optimized): Call POST /api/v1/optimize-weights. Send the user's current context (Sector, Stage, Tool, Persona). The backend will return an AI-calculated weight dictionary and a reasoning string to display to the user.

4. Generating Reports
Once the user has configured their context, trigger the massive LangGraph AI workflows.

For the Main Report:

Endpoint: POST /api/v1/generate-report

Payload: Send the selected sector, stage, persona, weights, and the input_tool_name (just the string name).

Response: Returns the full report_markdown.

5. For the 1-on-1 Comparison:

Endpoint: POST /api/v1/compare-tools

Payload: Send the sector, stage, persona, weights, the input_tool_name, and the compare_tool_name.

Response: Returns the focused 1-on-1 report_markdown