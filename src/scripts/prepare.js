const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { basename, join } = require('path');
const semver = require('semver');

const pluginDir = join(__dirname, '..')
const aarFile = join(pluginDir, 'platforms', 'android', 'nativescript_google_maps_sdk.aar')

if (existsSync(aarFile)) {
    console.log(`nativescript-google-maps prepare.js: ✅ ${basename(aarFile)} already exists, skipping ns plugin build`)
} else {
    let command = `ns --version`
    try {
        const nsVer = execSync(command).toString().split(/\r?\n/g).find(l => /^\d[0-9.]+\d$/.test(l))
        const nsVersion = semver.major(nsVer);
        
        // execute 'ns plugin build' for {N} version > 4. This command builds .aar in platforms/android folder.
        if (nsVersion >= 4) {
            command = `ns plugin build`
            execSync(command, { stdio: 'inherit', cwd: pluginDir })
        }
    } catch (error) {
        console.log(`prepare.js error. Last command: ${command}`, error)
    }
}
