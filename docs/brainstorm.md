roles:
- admin: full access
- moderator: accept/reject contributions
- delegate: full access to his own class (not for now)
- user: contribute
- visitor: browse resources

resource types:
- lecture
- DW Worksheet
- PW Worksheet
- Interro
- Exam
- PW Exam

resource data:
- type
- chapter?
- academic level
- academic year
- semester
- section
- group?
- major
- module
- professor

extra tables for faster indexing:
- modules
- majors
- professors


general flow:
- visitors can go to browse resources
- users log in via google
- users can contribute resources
- moderators and admins can accept or reject a contribution which will either make it accessible to everyone or hide it