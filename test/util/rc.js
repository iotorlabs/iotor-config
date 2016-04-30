var expect = require('expect.js');
var helpers = require('../helpers');

describe('rc', function () {
  var tempDir = new helpers.TempDir();
  var tempDirBowerrc = new helpers.TempDir();

  var rc = require('../../lib/util/rc');

  tempDir.prepare({
    '.racoonrc': {
      key: 'value'
    },
    'child/.racoonrc': {
      key2: 'value2'
    },
    'child2/.racoonrc': {
      key: 'valueShouldBeOverwriteParent'
    },
    'child3/racoon.json': {
      name: 'without-racoonrc'
    },
    'other_dir/.racoonrc': {
      key: 'othervalue'
    }
  });

  tempDirBowerrc.prepare({
    '.racoonrc/foo': {
      key: 'bar'
    }

  });

  it('correctly reads .racoonrc files', function () {
    var config = rc('racoon', tempDir.path);

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql(undefined);
  });

  it('correctly reads .racoonrc files from child', function () {
    var config = rc('racoon', tempDir.path + '/child/');

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql('value2');
  });

  it('correctly reads .racoonrc files from child2', function () {
    var config = rc('racoon', tempDir.path + '/child2/');

    expect(config.key).to.eql('valueShouldBeOverwriteParent');
    expect(config.key2).to.eql(undefined);
  });

  it('correctly reads .racoonrc files from child3', function () {
    var config = rc('racoon', tempDir.path + '/child3/');

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql(undefined);
  });

  it('loads the .racoonrc file from the cwd specified on the command line', function () {
    var argv = {
      'config': {
        'cwd': tempDir.path + '/other_dir/'
      }
    };

    var config = rc('racoon', tempDir.path, argv);

    expect(config.key).to.eql('othervalue');

  });

  it('throws an easy to understand error if .racoonrc is a dir', function () {
    // Gotta wrap this to catch the error
    var config = function () {
      rc('racoon', tempDirBowerrc.path);
    };

    expect(config).to.throwError(/should not be a directory/);
  });
});
