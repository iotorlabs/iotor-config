var expect = require('expect.js');
var helpers = require('../helpers');

describe('rc', function () {
  var tempDir = new helpers.TempDir();
  var tempDirBowerrc = new helpers.TempDir();

  var rc = require('../../lib/util/rc');

  tempDir.prepare({
    '.anorc': {
      key: 'value'
    },
    'child/.anorc': {
      key2: 'value2'
    },
    'child2/.anorc': {
      key: 'valueShouldBeOverwriteParent'
    },
    'child3/ano.json': {
      name: 'without-anorc'
    },
    'other_dir/.anorc': {
      key: 'othervalue'
    }
  });

  tempDirBowerrc.prepare({
    '.anorc/foo': {
      key: 'bar'
    }

  });

  it('correctly reads .anorc files', function () {
    var config = rc('ano', tempDir.path);

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql(undefined);
  });

  it('correctly reads .anorc files from child', function () {
    var config = rc('ano', tempDir.path + '/child/');

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql('value2');
  });

  it('correctly reads .anorc files from child2', function () {
    var config = rc('ano', tempDir.path + '/child2/');

    expect(config.key).to.eql('valueShouldBeOverwriteParent');
    expect(config.key2).to.eql(undefined);
  });

  it('correctly reads .anorc files from child3', function () {
    var config = rc('ano', tempDir.path + '/child3/');

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql(undefined);
  });

  it('loads the .anorc file from the cwd specified on the command line', function () {
    var argv = {
      'config': {
        'cwd': tempDir.path + '/other_dir/'
      }
    };

    var config = rc('ano', tempDir.path, argv);

    expect(config.key).to.eql('othervalue');

  });

  it('throws an easy to understand error if .anorc is a dir', function () {
    // Gotta wrap this to catch the error
    var config = function () {
      rc('ano', tempDirBowerrc.path);
    };

    expect(config).to.throwError(/should not be a directory/);
  });
});
