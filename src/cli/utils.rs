/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

use std::env;
use std::path::PathBuf;

pub fn find_turbo(cwd: PathBuf, path_segments: String) -> Option<(PathBuf, String)> {
    println!("cwd: {} || path: {}", cwd.display(), path_segments);
    let turbo_path = cwd.join("turbo.json");
    if turbo_path.exists() {
        return Some((turbo_path, path_segments));
    } else {
        let parent = cwd
            .parent()
            .expect(format!("Could not find parent of {}", cwd.display()).as_str())
            .to_path_buf();
        let path_segments = format!(
            "{}/{}",
            cwd.file_name().unwrap().to_str().unwrap(),
            path_segments,
        );
        return find_turbo(parent, path_segments);
    }
}

pub struct TypeDir {
    type_name: String,
    dir_name: String,
}

pub fn get_type_and_dir() -> TypeDir {
    // the current working directory is `$ROOT/$TYPE/$DIR`
    let dir_path = env::current_dir().unwrap();
    let dir_name = dir_path.file_name().unwrap().to_str().unwrap();

    let type_path = dir_path.parent().unwrap();
    let type_name = type_path.file_name().unwrap().to_str().unwrap();
    return TypeDir {
        type_name: type_name.to_string(),
        dir_name: dir_name.to_string(),
    };
}
