import os

def main():
    file_path = os.path.join("src", "lib", "blogTranslationsData.ts")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the start of post-use-1
    start_key = '"post-use-1": {'
    end_key = '"post-use-2": {'
    
    start_idx = content.find(start_key)
    if start_idx == -1:
        print("Could not find post-use-1 start key!")
        return
        
    end_idx = content.find(end_key)
    if end_idx == -1:
        print("Could not find post-use-2 end key!")
        return

    replacement = """\"post-use-1\": {
    "it": {
      slug: "friggere-con-olio-evo",
      title: "Friggere con l'olio extravergine: falso mito o realtà culinaria?",
      excerpt: "Risolleviamo l'onore del fritto con olio EVO smontando alcune false credenze radicate sui punti di fumo.",
      category: "Consumo corretto"
    },
    "en": {
      slug: "frying-with-extra-virgin-olive-oil-myth-or-reality",
      title: "Frying with Extra Virgin Olive Oil: Myth or Culinary Reality?",
      excerpt: "Let's restore the honor of frying with EVOO by debunking deeply rooted myths about smoke points.",
      category: "Proper Usage"
    },
    "de": {
      slug: "frittieren-mit-olivenoel-extra-mythos-oder-realitaet",
      title: "Frittieren mit nativem Olivenöl Extra: Mythos oder kulinarische Realität?",
      excerpt: "Wir stellen die Ehre des Frittierens mit Olivenöl Extra wieder her, indem wir gegen hartnäckige Mythen über den Rauchpunkt vorgehen.",
      category: "Richtiges Genießen"
    },
    "nl": {
      slug: "frituren-met-extra-vierge-olijfolie-mythe-of-realiteit",
      title: "Frituren met extra vierge olijfolie: mythe of culinaire realiteit?",
      excerpt: "We herstellen de eer van gefrituurd eten met extra vierge olijfolie door hardnekkige mythen over het rookpunt te ontkrachten.",
      category: "Correct Gebruik"
    },
    "da": {
      slug: "friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag",
      title: "Friturestegning med ekstra jomfruolivenolie: Myte eller kulinarisk virkelighed?",
      excerpt: "Vi genopretter æren for friturestegt mad med ekstra jomfruolivenolie by aflive nogle dybt forankrede myter om røgpunkter.",
      category: "Korrekt Forbrug"
    },
    "no": {
      slug: "fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet",
      title: "Fritering med ekstra jomfruolivenolje: Myte eller kulinarisk virkelighet?",
      excerpt: "Vi gjenreiser æren for fritert mat med ekstra jomfruolivenolje ved av avlive noen dypt forankrede myter om røykpunkter.",
      category: "Riktig Bruk"
    }
  },
  """

    new_content = content[:start_idx] + replacement + content[end_idx:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print("Successfully replaced post-use-1 section!")

if __name__ == "__main__":
    main()
