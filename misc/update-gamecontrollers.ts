/**
 * Update gamecontrollers -- A helper function to populate a JSON db with game controller info
 * directly from the SDL3 source code, and write it to controllerdb.json.
 * 
 * Entries are parsed [from community db](https://raw.githubusercontent.com/mdqinc/SDL_GameControllerDB/refs/heads/master/gamecontrollerdb.txt).
 */

import { writeFileSync } from "node:fs";

const CRC16offset = 0;//0x100000000;

const buttonMap = [
  { sdl: "a", like: "BBottom" },
  { sdl: "b", like: "BRight" },
  { sdl: "x", like: "BLeft" },
  { sdl: "y", like: "BTop" },
  { sdl: "leftshoulder", like: "L1" },
  { sdl: "rightshoulder", like: "R1" },
  { sdl: "lefttrigger", like: "L2" },
  { sdl: "righttrigger", like: "R2" },
  { sdl: "back", like: "MenuLeft" },
  { sdl: "start", like: "MenuRight" },
  { sdl: "leftstick", like: "LeftStick" },
  { sdl: "rightstick", like: "RightStick" },
  { sdl: "dpup", like: "Up" },
  { sdl: "dpdown", like: "Down" },
  { sdl: "dpleft", like: "Left" },
  { sdl: "dpright", like: "Right" },
] as const;

const sdlButtonSet = new Set<string>(buttonMap.map(({ sdl }) => sdl));
const sdlToLikeMap = new Map<string, LikeButton>(
  buttonMap.map(({ sdl, like }) => [sdl, like]),
);

type LikeButton = typeof buttonMap[number]['like'];

type SdlMapping = {
  vendor: number;
  product: number;
  crc16?: number;
  name: string;
  mapping: Record<number, LikeButton>;
  os: string;
};

type OsSection = Record<number, SdlMapping>;
type MappingDb = Record<string, OsSection>;

async function generateMappingDb(): Promise<Record<string, OsSection>> {
    const header = await fetch(
      "https://raw.githubusercontent.com/mdqinc/SDL_GameControllerDB/refs/heads/master/gamecontrollerdb.txt",
    ).then((r) => r.text());

    const db: MappingDb = {};
    let mappingCount = 0;
    let duplicateMappingCount = 0;
    let ambiguousMappingCount = 0;
    let fullyAmbiguousMappingCount = 0;

    for (const line of header.split('\n')) {
        const map = parseDbLine(line);
        if (map) {
            const entry = (map.crc16 ?? 0) * CRC16offset + map.vendor * 0x10000 + map.product;
            db[map.os] ??= {};
            const section = db[map.os];
            if (entry in section) {
                // A mapping already exists, so find the intersection of that
                // and this mapping. Never bind ambiguous values.
                let ambiguous = false;

                const mapping = Object.fromEntries(
                    Object.entries(map.mapping).filter(
                    ([k, v]) => {
                        const matches = section[entry].mapping[Number(k)] === v;
                        ambiguous = ambiguous || !matches;
                        return matches;
                    }
                    ),
                );

                if (ambiguous) ++ambiguousMappingCount;
                ++duplicateMappingCount;

                let name = map.name;
                if (!section[entry].name.includes(map.name)) {
                    name = map.name + " | " + section[entry].name;
                }
                section[entry] = {...map, name, mapping}
            } else {
                ++mappingCount;
                section[entry] = map;
            }
        }
    }

    for (const os of Object.keys(db)) {
        for (const entry of Object.keys(db[os])) {
            const mapping = db[os][Number(entry)].mapping;
            if (!Object.keys(mapping).length) {
                delete db[os][Number(entry)];
                fullyAmbiguousMappingCount++;
            }
        }
    }

    console.log(`
Parsed Gamepad DB:
    total: ${mappingCount}
    duplicates: ${duplicateMappingCount}
    ambiguous: ${ambiguousMappingCount}
    fully ambiguous (pruned): ${fullyAmbiguousMappingCount}
    `);

    return db;
}

function parseDbLine(line: string): SdlMapping | undefined {
  if (line.trimStart().startsWith('#')) {
    return;
  }
  const [guid, name, ...mappings] = line.split(",");
  mappings.pop(); // trailing comma

  const vendor = 
    parseInt(guid.substring(8, 10), 16) +
    0x100 * parseInt(guid.substring(10, 12), 16);

  const product =
    parseInt(guid.substring(16, 18), 16) +
    0x100 * parseInt(guid.substring(18, 20), 16);

  if (!vendor || !product) return;

  let os = "Linux";
  const mapping: Record<number, LikeButton> = Object.fromEntries(
    mappings
      .map((s) => {
        const [sdl, bname] = s.split(":");
        if (sdl == "platform") {
          os = bname;
        }
        const browserIndex = sdlRawButtonToBrowser(bname);
        return (
          browserIndex !== undefined &&
          sdlButtonSet.has(sdl) && [browserIndex, sdlToLikeMap.get(sdl)]
        );
      })
      .filter((v) => !!v) as [number, LikeButton][],
  );

  return { name, vendor, product, mapping, os };
}

function sdlRawButtonToBrowser(btn: string): number | undefined {
  return btn.startsWith("b") ? Number(btn.substring(1)) : undefined;
}

const mappingDb = await generateMappingDb();
writeFileSync("./like/src/input/controllerdb.json", JSON.stringify(mappingDb));