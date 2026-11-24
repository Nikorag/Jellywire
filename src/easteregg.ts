import type { SearchResult } from "./types/jellyfin";

/** Sentinel serverId used by easter-egg results — never matches a real
 *  server, so attempting to download one fails immediately (see
 *  downloadManager.ts), just like the "free_ipod.exe" era intended. */
export const EASTER_EGG_SERVER_ID = "easteregg";

export interface EasterEggFile {
  filename: string;
  size: string;
}

export const limewireFiles: EasterEggFile[] = [
  { filename: "linking_park_numb.exe", size: "3kb" },
  { filename: "linking_park_in_the_end.mp3.exe", size: "3kb" },
  { filename: "linking_park_crawling.mp3.exe", size: "3kb" },
  { filename: "linking_park_breaking_the_habit.mp3.exe", size: "3kb" },
  { filename: "linking_park_one_step_closer.exe", size: "3kb" },
  { filename: "linking_park_somewhere_i_belong.mp3.exe", size: "3kb" },
  { filename: "linking_park_faint.mp3.exe", size: "3kb" },

  { filename: "system_of_a_down_break_stuff.mp3.exe", size: "3kb" },
  { filename: "system_of_a_down_in_the_end.mp3.exe", size: "3kb" },
  { filename: "system_of_a_down_chop_suey.exe", size: "3kb" },
  { filename: "eminem_lose_yourself.mp3.exe", size: "3kb" },
  { filename: "eminem_in_da_club.mp3.exe", size: "3kb" },
  { filename: "50_cent_mockingbird.mp3.exe", size: "3kb" },
  { filename: "50_cent_lose_yourself.exe", size: "3kb" },
  { filename: "britney_spears_since_u_been_gone.mp3.exe", size: "3kb" },
  { filename: "avril_lavigne_complicated.mp3.exe", size: "3kb" },
  { filename: "avril_lavigne_my_immortal.mp3.exe", size: "3kb" },
  { filename: "evanescence_what_is_love.mp3.exe", size: "3kb" },
  { filename: "nirvana_smells_like_teen_spirit.exe", size: "3kb" },
  { filename: "nirvana_enter_sandman.mp3.exe", size: "3kb" },
  { filename: "metallica_smells_like_teen_spirit.mp3.exe", size: "3kb" },
  { filename: "metallica_in_the_end.exe", size: "3kb" },
  { filename: "blink_182_mr_brightside.mp3.exe", size: "3kb" },
  { filename: "the_killers_all_the_small_things.mp3.exe", size: "3kb" },
  { filename: "green_day_teenage_dirtbag.mp3.exe", size: "3kb" },
  { filename: "weezer_boulevard_of_broken_dreams.exe", size: "3kb" },
  { filename: "my_chemical_romance_helena.mp3.exe", size: "3kb" },
  { filename: "my_chemical_romance_numb.mp3.exe", size: "3kb" },
  { filename: "fall_out_boy_mr_brightside.exe", size: "3kb" },
  { filename: "panic_at_the_disco_misery_business.mp3.exe", size: "3kb" },
  { filename: "foo_fighters_chop_suey.exe", size: "3kb" },
  { filename: "red_hot_chili_peppers_american_idiot.mp3.exe", size: "3kb" },
  { filename: "system_of_a_down_bring_me_to_life.exe", size: "3kb" },
  { filename: "evanescence_chop_suey.mp3.exe", size: "3kb" },
  { filename: "linking_park_my_immortal.mp3.exe", size: "3kb" },
  { filename: "linking_park_break_stuff.exe", size: "3kb" },
  { filename: "linking_park_teenage_dirtbag.mp3.exe", size: "3kb" },
  { filename: "linking_park_mr_brightside.exe", size: "3kb" },

  { filename: "gta_san_andreas_full.exe", size: "3kb" },
  { filename: "gta_vice_city_crack.exe", size: "3kb" },
  { filename: "gta_sa_no_cd_patch.exe", size: "3kb" },
  { filename: "halo_2_full_version.exe", size: "3kb" },
  { filename: "halo_3_pc.exe", size: "3kb" },
  { filename: "counter_strike_source_full.exe", size: "3kb" },
  { filename: "half_life_2_crack.exe", size: "3kb" },
  { filename: "need_for_speed_most_wanted.exe", size: "3kb" },
  { filename: "nfs_underground_2_crack.exe", size: "3kb" },
  { filename: "the_sims_2_crack.exe", size: "3kb" },
  { filename: "pokemon_ruby_pc.exe", size: "3kb" },
  { filename: "pokemon_crystal_pc.exe", size: "3kb" },
  { filename: "super_mario_64_pc.exe", size: "3kb" },
  { filename: "zelda_ocarina_of_time.exe", size: "3kb" },
  { filename: "ps2_emulator_working.exe", size: "3kb" },
  { filename: "xbox_360_emulator.exe", size: "3kb" },

  { filename: "windows_xp_serial_generator.exe", size: "3kb" },
  { filename: "windows_xp_keygen.exe", size: "3kb" },
  { filename: "windows_vista_crack.exe", size: "3kb" },
  { filename: "limewire_pro_crack.exe", size: "3kb" },
  { filename: "limewire_pro_full.exe", size: "3kb" },
  { filename: "winamp_pro_crack.exe", size: "3kb" },
  { filename: "winrar_keygen.exe", size: "3kb" },
  { filename: "photoshop_cs2_keygen.exe", size: "3kb" },
  { filename: "norton_antivirus_crack.exe", size: "3kb" },
  { filename: "free_ipod.exe", size: "3kb" },
  { filename: "free_psp.exe", size: "3kb" },
  { filename: "free_ringtone_generator.exe", size: "3kb" },
  { filename: "internet_booster.exe", size: "3kb" },
  { filename: "msn_password_hack.exe", size: "3kb" },

  { filename: "funniest_video_ever.mpg.exe", size: "3kb" },
  { filename: "jackass_uncut_episode.exe", size: "3kb" },
  { filename: "scary_movie_4_full.avi.exe", size: "3kb" },
  { filename: "matrix_3_full_movie.exe", size: "3kb" },
  { filename: "pirates_of_the_caribbean_full.exe", size: "3kb" },
  { filename: "star_wars_episode_3_full.exe", size: "3kb" },
  { filename: "spiderman_3_full_movie.exe", size: "3kb" },
  { filename: "you_wont_believe_this.exe", size: "3kb" },
  { filename: "DO_NOT_OPEN.exe", size: "3kb" },
  { filename: "IMPORTANT_READ_ME.exe", size: "3kb" },
  { filename: "photo_album.exe", size: "3kb" },
  { filename: "my_pictures.zip.exe", size: "3kb" },
  { filename: "FREE_MONEY.exe", size: "3kb" },
  { filename: "make_money_fast.exe", size: "3kb" },
  { filename: "free_screensavers.exe", size: "3kb" },
  { filename: "cool_3d_screensaver.exe", size: "3kb" },
  { filename: "100000_serial_numbers.txt.exe", size: "3kb" }
];

function parseSizeToBytes(size: string): number {
  const match = size.trim().match(/^([\d.]+)\s*(b|kb|mb|gb)$/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const multiplier = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 }[match[2].toLowerCase()] ?? 1;
  return Math.round(value * multiplier);
}

function toDisplayTitle(filename: string): string {
  const withoutExe = filename.replace(/\.exe$/i, "");
  const withoutSecondaryExt = withoutExe.replace(/\.(mp3|avi|mpg|zip|txt)$/i, "");
  return withoutSecondaryExt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Rolls a number 1–100; below 30 (~29% chance), returns a fake "top result"
 * built from limewireFiles. Attempting to download it always fails because
 * its serverId never matches a real connected server (see downloadManager.ts).
 */
export function maybeGetEasterEggResult(): SearchResult | null {
  const roll = Math.floor(Math.random() * 100) + 1;
  if (roll >= 30) return null;

  const file = limewireFiles[Math.floor(Math.random() * limewireFiles.length)];
  return {
    id: `easteregg:${file.filename}`,
    serverId: EASTER_EGG_SERVER_ID,
    serverName: "LimeWire Network",
    itemId: file.filename,
    title: toDisplayTitle(file.filename),
    filename: file.filename,
    kind: "Other",
    sizeBytes: parseSizeToBytes(file.size),
    container: "exe",
    communityRating: 10,
    playCount: 999_999,
  };
}
