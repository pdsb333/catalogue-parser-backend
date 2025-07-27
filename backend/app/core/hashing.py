import bcrypt

def hasher_mot_de_passe(mdp: str) -> str:
    hashed = bcrypt.hashpw(mdp.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def verifier_mot_de_passe(mdp_saisi: str, mdp_hash: str) -> bool:
    return bcrypt.checkpw(mdp_saisi.encode('utf-8'), mdp_hash.encode('utf-8'))





